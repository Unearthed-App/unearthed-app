/**
 * Copyright (C) 2024 Unearthed App
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq, inArray, isNull, lte, or, sql } from "drizzle-orm";
import { notionSourceJobsThree, selectProfileSchema } from "@/db/schema";
import { db } from "@/db";
import { z } from "zod";
import PostHogClient from "@/app/posthog";
import { clerkClient } from "@clerk/nextjs/server";
import { decrypt } from "@/lib/auth/encryptionKey";
import { generateUUID } from "@/lib/utils";
const { Client } = require("@notionhq/client");
type Profile = z.infer<typeof selectProfileSchema>;

const MAX_CHILDREN = 100; // Notion child block limit

interface NotionPageProperties {
  Title: {
    title: {
      type: string;
      text: {
        content: string;
      };
    }[];
  };
  Subtitle: {
    rich_text: {
      type: string;
      text: {
        content: string;
      };
    }[];
  };
  Author: {
    rich_text: {
      type: string;
      text: {
        content: string;
      };
    }[];
  };
  Origin: {
    rich_text: {
      type: string;
      text: {
        content: string;
      };
    }[];
  };
  Image?: {
    files: {
      name: string;
      type: string;
      external: {
        url: string;
      };
    }[];
  };
}

interface NotionPage {
  parent: {
    database_id: string;
  };
  properties: NotionPageProperties;
  cover?: {
    type: string;
    external: {
      url: string;
    };
  };
}

function splitLongContent(
  content: string,
  maxLength = 2000,
  type = "quote",
  notionColor = "gray"
) {
  const chunks = [];
  let remaining = content;

  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      chunks.push(remaining);
      break;
    }

    let chunk = remaining.slice(0, maxLength);
    let lastSpaceIndex = chunk.lastIndexOf(" ");

    if (lastSpaceIndex > maxLength * 0.8) {
      chunk = chunk.slice(0, lastSpaceIndex);
    }

    chunks.push(chunk);
    remaining = remaining.slice(chunk.length).trim();
  }

  return chunks.map((chunk, index) => {
    if (type === "quote") {
      return {
        type: "quote",
        quote: {
          rich_text: [
            {
              type: "text",
              text: {
                content: chunk,
              },
            },
          ],
          color: notionColor,
          children: [],
        },
      };
    } else {
      return {
        type: "callout",
        callout: {
          rich_text: [
            {
              type: "text",
              text: {
                content: chunk,
                link: null,
              },
            },
          ],
          icon: {
            emoji: index === 0 ? "📝" : "➡️",
          },
          color: "default",
        },
      };
    }
  });
}

export async function GET() {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  const validToken = process.env.CRON_TOKEN;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  if (token !== validToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notionSourceJobs = await db.query.notionSourceJobsThree.findMany({
    where: and(
      eq(notionSourceJobsThree.status, "READY"),
      or(
        isNull(notionSourceJobsThree.attempts),
        lte(notionSourceJobsThree.attempts, 3)
      )
    ),
    with: {
      source: {
        with: {
          quotes: true,
          media: true,
        },
      },
      profile: true,
    },
    limit: 3,
  });

  if (notionSourceJobs.length === 0) {
    return NextResponse.json({ message: "No jobs found" }, { status: 200 });
  }

  const sourceIds = notionSourceJobs.map((row) => row.sourceId);

  await db
    .update(notionSourceJobsThree)
    .set({
      attempts: sql`COALESCE(${notionSourceJobsThree.attempts}, 0) + 1`,
    })
    .where(inArray(notionSourceJobsThree.sourceId, sourceIds));

  try {
    const posthogClient = PostHogClient();

    const distinctId = generateUUID();

    posthogClient.capture({
      distinctId,
      event: `notion-jobs-three BEGIN`,
      properties: {
        sourceIds,
      },
    });

    for (const row of notionSourceJobs) {
      posthogClient.capture({
        distinctId: row.source.userId,
        event: `notion-jobs-three`,
        properties: {
          newConnection: row.newConnection,
          sourceName: row.source.title,
        },
      });

      try {
        const profile: Profile = row.profile;
        const source = row.source;

        const client = await clerkClient();
        const user = await client.users.getUser(profile.userId);
        const encryptionKey = user.privateMetadata.encryptionKey as string;
        profile.notionAuthData = profile.notionAuthData
          ? await decrypt(profile.notionAuthData as string, encryptionKey)
          : "";

        const notionAuthData = JSON.parse(profile.notionAuthData || "{}");

        if (!notionAuthData || !notionAuthData.access_token) {
          throw new Error("No notion auth found");
        }

        const notion = new Client({ auth: notionAuthData.access_token });
        const notionUserId = notionAuthData.owner?.user?.id;

        if (!notionUserId) {
          throw new Error("No notion user found");
        }
        let notionBooksDatabaseId = profile.notionDatabaseId;

        if (!notionBooksDatabaseId) {
          throw new Error("No notion database found");
        }
        let notionBookContent: any = {};
        let bookInNotionAlready = false;

        if (!row.newConnection) {
          await new Promise((resolve) => setTimeout(resolve, 300));

          // get pages from notion in the sources database
          const response = await notion.databases.query({
            database_id: notionBooksDatabaseId,
          });
          for (const page of response.results) {
            // see if the book is already in notion
            const key: string = `${page.properties.Title.title[0].plain_text} ${page.properties.Author.rich_text[0].plain_text}`;

            // if it doesn't match, check the next page
            if (key != `${source.title} ${source.author}`) {
              continue;
            }

            bookInNotionAlready = true;
            let allQuotePlainText: string[] = [];
            let hasMore = true;
            let startCursor = undefined;

            while (hasMore) {
              await new Promise((resolve) => setTimeout(resolve, 300));

              const {
                results,
                has_more,
                next_cursor,
              }: {
                results: any[];
                has_more: boolean;
                next_cursor: string | undefined;
              } = await notion.blocks.children.list({
                block_id: page.id,
                start_cursor: startCursor,
                page_size: 100,
              });

              const quotePlainText = results
                .filter((block) => block.type === "quote")
                .map((block) =>
                  block.quote.rich_text
                    .map(
                      (richTextObject: { plain_text: string }) =>
                        richTextObject.plain_text
                    )
                    .join("")
                );

              allQuotePlainText = allQuotePlainText.concat(quotePlainText);

              hasMore = has_more;
              startCursor = next_cursor;
            }

            notionBookContent = {
              blockId: page.id,
              key: key,
              allQuotePlainText: allQuotePlainText,
            };
          }
        }

        let quotesForNewSource = [];
        let quotesForExistingSource = [];

        quotesForNewSource.push({
          type: "heading_2",
          heading_2: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: "Quotes and Notes",
                },
              },
            ],
          },
        });

        for (const quote of source.quotes) {
          let mustAddToExistingSource = true;

          if (bookInNotionAlready) {
            // check to see if this quote is already in notion
            if (notionBookContent.allQuotePlainText.includes(quote.content)) {
              mustAddToExistingSource = false;
            }
          }

          let notionColor = "gray";
          const lowerCaseColor = quote.color?.toLowerCase();

          if (lowerCaseColor?.includes("grey")) {
            notionColor = "gray";
          } else if (lowerCaseColor?.includes("yellow")) {
            notionColor = "yellow";
          } else if (lowerCaseColor?.includes("blue")) {
            notionColor = "blue";
          } else if (lowerCaseColor?.includes("pink")) {
            notionColor = "pink";
          } else if (lowerCaseColor?.includes("orange")) {
            notionColor = "orange";
          }

          const quoteBlocks = splitLongContent(
            quote.content || "No quote...",
            2000,
            "quote",
            notionColor
          );
          quotesForNewSource.push(...quoteBlocks);
          if (mustAddToExistingSource) {
            quotesForExistingSource.push(...quoteBlocks);
          }

          if (quote.note) {
            const decryptedNote = await decrypt(quote.note, encryptionKey);
            const noteBlocks = splitLongContent(decryptedNote, 2000, "note");

            quotesForNewSource.push(...noteBlocks);
            if (mustAddToExistingSource) {
              quotesForExistingSource.push(...noteBlocks);
            }
          }

          const locationBlock = {
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: ("📍 " + quote.location) as string,
                    link: null,
                  },
                },
              ],
              color: "gray",
            },
          };
          quotesForNewSource.push(locationBlock);
          if (mustAddToExistingSource) {
            quotesForExistingSource.push(locationBlock);
          }

          const dividerBlock = {
            type: "divider",
            divider: {},
          };
          quotesForNewSource.push(dividerBlock);
          if (mustAddToExistingSource) {
            quotesForExistingSource.push(dividerBlock);
          }
        }

        if (bookInNotionAlready) {
          for (
            let i = 0;
            i < quotesForExistingSource.length;
            i += MAX_CHILDREN
          ) {
            const childBatch = quotesForExistingSource.slice(
              i,
              i + MAX_CHILDREN
            );

            await new Promise((resolve) => setTimeout(resolve, 300));

            await notion.blocks.children.append({
              block_id: notionBookContent.blockId,
              children: childBatch,
            });
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 300));

          const pageObject: NotionPage = {
            parent: { database_id: notionBooksDatabaseId },
            properties: {
              Title: {
                title: [
                  {
                    type: "text",
                    text: {
                      content: source.title || "Untitled",
                    },
                  },
                ],
              },
              Subtitle: {
                rich_text: [
                  {
                    type: "text",
                    text: {
                      content: source.subtitle || "",
                    },
                  },
                ],
              },
              Author: {
                rich_text: [
                  {
                    type: "text",
                    text: {
                      content: source.author || "Unknown",
                    },
                  },
                ],
              },
              Origin: {
                rich_text: [
                  {
                    type: "text",
                    text: {
                      content: source.origin || "",
                    },
                  },
                ],
              },
            },
          };

          if (source.media && source.media.url) {
            pageObject.properties.Image = {
              files: [
                {
                  name: "Book Cover",
                  type: "external",
                  external: {
                    url: source.media.url || "",
                  },
                },
              ],
            };

            pageObject.cover = {
              type: "external",
              external: {
                url: source.media.url || "",
              },
            };
          }

          const notionBook = await notion.pages.create(pageObject);

          await new Promise((resolve) => setTimeout(resolve, 300));

          for (let i = 0; i < quotesForNewSource.length; i += MAX_CHILDREN) {
            const childBatch = quotesForNewSource.slice(i, i + MAX_CHILDREN);

            await notion.blocks.children.append({
              block_id: notionBook.id,
              children: childBatch,
            });
          }
        }

        await db
          .update(notionSourceJobsThree)
          .set({
            status: "COMPLETE",
          })
          .where(eq(notionSourceJobsThree.sourceId, row.sourceId));
      } catch (error) {
        posthogClient.capture({
          distinctId: row.source.userId,
          event: `notion-jobs-three ERROR`,
          properties: {
            message:
              error instanceof Error ? error.message : "Unknown error occurred",
          },
        });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
