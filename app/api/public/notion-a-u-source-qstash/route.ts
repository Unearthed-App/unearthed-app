import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { profiles, selectSourceWithRelationsSchema } from "@/db/schema";
import { decrypt } from "@/lib/auth/encryptionKey";

import { clerkClient } from "@clerk/nextjs/server";
import { isNotNull, and, eq } from "drizzle-orm";
const { Client } = require("@notionhq/client");
import PostHogClient from "@/app/posthog";
import { serve } from "@upstash/qstash/nextjs";

const MAX_CHILDREN = 100; // Notion child block limit
type Source = z.infer<typeof selectSourceWithRelationsSchema>;

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

export const POST = serve<{ source: Source }>(async (context) => {
  await context.run(`notion-a-u-source-qstash`, async () => {
    const source: Source = context.requestPayload.source;
    const posthogClient = PostHogClient();

    const headersList = headers();
    const authHeader = headersList.get("authorization");

    const validToken = process.env.CRON_TOKEN;

    try {
      if (!source) {
        throw new Error("No source found");
      }
      posthogClient.capture({
        distinctId: `${source.userId}`,
        event: `notion-a-u-source-qstash START`,
        properties: {
          source: {
            id: source.id,
            title: source.title,
            quotes: source.quotes.length,
          },
        },
      });

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("No auth header");
      }

      const token = authHeader.split(" ")[1];

      if (token !== validToken) {
        throw new Error("No token found");
      }

      let dbResult;
      let passedUserId: string | null = null;

      passedUserId = source.userId;

      dbResult = await db.query.profiles.findMany({
        where: and(
          isNotNull(profiles.notionAuthData),
          eq(profiles.userId, passedUserId)
        ),
      });
      if (!dbResult || dbResult.length == 0) {
        throw new Error("db.query failed");
      }

      const profile = dbResult[0];
      let bookInNotionAlready = false;
      const user = await clerkClient().users.getUser(profile.userId);
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

      // get pages from notion in the sources database
      const response = await notion.databases.query({
        database_id: notionBooksDatabaseId,
      });
      let notionBookContent: any = {};
      for (const page of response.results) {
        // see if the book is already in notion
        const key: string = `${page.properties.Title.title[0].plain_text} ${page.properties.Subtitle.rich_text[0].plain_text}`;

        // if it doesn't match, check the next page
        if (key != `${source.title} ${source.subtitle}`) {
          continue;
        }

        bookInNotionAlready = true;
        let allQuotePlainText: string[] = [];
        let hasMore = true;
        let startCursor = undefined;

        while (hasMore) {
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
        for (let i = 0; i < quotesForExistingSource.length; i += MAX_CHILDREN) {
          const childBatch = quotesForExistingSource.slice(i, i + MAX_CHILDREN);

          await notion.blocks.children.append({
            block_id: notionBookContent.blockId,
            children: childBatch,
          });
        }
      } else {
        const notionBook = await notion.pages.create({
          parent: { database_id: notionBooksDatabaseId },
          cover: {
            type: "external",
            external: {
              url: source.imageUrl || null,
            },
          },
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
            Image: {
              files: [
                {
                  name: "Book Cover",
                  type: "external",
                  external: {
                    url: source.imageUrl || null,
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
        });

        for (let i = 0; i < quotesForNewSource.length; i += MAX_CHILDREN) {
          const childBatch = quotesForNewSource.slice(i, i + MAX_CHILDREN);

          await notion.blocks.children.append({
            block_id: notionBook.id,
            children: childBatch,
          });
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error in Notion redirect handler:", error);
      posthogClient.capture({
        distinctId: source.userId,
        event: `notion-a-u-source-qstash ERROR`,
        properties: {
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        },
      });

      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  });
});
