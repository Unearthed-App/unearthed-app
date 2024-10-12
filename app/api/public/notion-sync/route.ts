import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import {
  profiles,
  selectSourceWithRelationsSchema,
  sources,
} from "@/db/schema";
import { decrypt } from "@/lib/auth/encryptionKey";

import { clerkClient } from "@clerk/nextjs/server";
import { isNotNull, and, eq } from "drizzle-orm";
const { Client } = require("@notionhq/client");

import { serve } from "@upstash/qstash/nextjs";

export const POST = serve<{ userId: string; newConnection: boolean }>(
  async (context) => {
    const headersList = headers();
    const authHeader = headersList.get("authorization");

    const validToken = process.env.CRON_TOKEN;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
    } else {
      const token = authHeader.split(" ")[1];

      if (token !== validToken) {

      } else {

        let dbResult;
        let passedUserId: string | null = null;
        let newConnection: boolean | null = null;

        if (context.requestPayload) {
          passedUserId = context.requestPayload.userId;
          newConnection = context.requestPayload.newConnection;

          if (passedUserId) {
            dbResult = await context.run("get-profile", async () => {
              if (passedUserId) {
                return await db.query.profiles.findMany({
                  where: and(
                    isNotNull(profiles.notionAuthData),
                    eq(profiles.userId, passedUserId)
                  ),
                });
              }
            });
          }
        } else {
          dbResult = await context.run("get-profile", async () => {
            return await db.query.profiles.findMany({
              where: isNotNull(profiles.notionAuthData),
            });
          });
        }

        if (dbResult) {
          for (const profile of dbResult) {
            await context.run(`profile-${profile.userId}`, async () => {
              const user = await clerkClient().users.getUser(profile.userId);
              const encryptionKey = user.privateMetadata
                .encryptionKey as string;
              const userId = profile.userId;

              profile.notionAuthData = profile.notionAuthData
                ? await decrypt(profile.notionAuthData as string, encryptionKey)
                : "";
              const notionAuthData = JSON.parse(profile.notionAuthData || "{}");
              if (!notionAuthData || !notionAuthData.access_token) {
                return { success: false };
              }

              const notion = new Client({ auth: notionAuthData.access_token });
              const notionUserId = notionAuthData.owner?.user?.id;
              if (!notionUserId) {
                return { success: false };
              }

              let notionBooksDatabaseId;
              if (!profile.notionDatabaseId || newConnection) {
                const newDatabase = await notion.databases.create({
                  parent: {
                    type: "page_id",
                    page_id: notionAuthData.duplicated_template_id,
                  },
                  icon: {
                    type: "emoji",
                    emoji: "📚",
                  },
                  cover: {
                    type: "external",
                    external: {
                      url: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
                    },
                  },
                  title: [
                    {
                      type: "text",
                      text: {
                        content: "Sources",
                        link: null,
                      },
                    },
                  ],
                  properties: {
                    Title: { title: {} },
                    Subtitle: { rich_text: {} },
                    Author: { rich_text: {} },
                    Image: { files: {} },
                    Origin: { rich_text: {} },
                  },
                });

                if (newDatabase.id) {
                  notionBooksDatabaseId = newDatabase.id;

                  const result = await db
                    .update(profiles)
                    .set({
                      notionDatabaseId: notionBooksDatabaseId,
                    })
                    .where(eq(profiles.userId, userId));
                }
              } else {
                notionBooksDatabaseId = profile.notionDatabaseId;
              }

              if (!notionBooksDatabaseId) {
                return { success: false };
              }

              const dbResult = await db.query.sources.findMany({
                with: {
                  quotes: true,
                },
                where: and(
                  eq(sources.type, "BOOK"),
                  eq(sources.ignored, false),
                  eq(sources.userId, userId)
                ),
              });
              const books = z
                .array(selectSourceWithRelationsSchema)
                .parse(dbResult);

              if (!books || books.length === 0) {
                return { success: false };
              }

              const response = await notion.databases.query({
                database_id: notionBooksDatabaseId,
              });

              let booksInNotionAlreadyKeys: string[] = [];
              let notionBookContentPerBook: any[] = [];
              for (const page of response.results) {
                const key: string = `${page.properties.Title.title[0].plain_text} ${page.properties.Subtitle.rich_text[0].plain_text}`;
                booksInNotionAlreadyKeys.push(key);

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

                notionBookContentPerBook.push({
                  blockId: page.id,
                  key: key,
                  allQuotePlainText: allQuotePlainText,
                });
              }

              const booksInNotionAlready = [];

              const MAX_CHILDREN = 100; // Notion child block limit

              for (const book of books) {
                if (
                  booksInNotionAlreadyKeys.includes(
                    `${book.title} ${book.subtitle}`
                  )
                ) {
                  booksInNotionAlready.push(book);
                  continue;
                }

                let childQuotes = [];

                childQuotes.push({
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

                for (const quote of book.quotes) {
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

                  childQuotes.push({
                    type: "quote",
                    quote: {
                      rich_text: [
                        {
                          type: "text",
                          text: {
                            content: quote.content || "No quote...",
                          },
                        },
                      ],
                      color: notionColor,
                      children: [],
                    },
                  });

                  if (quote.note) {
                    childQuotes.push({
                      type: "callout",
                      callout: {
                        rich_text: [
                          {
                            type: "text",
                            text: {
                              content: await decrypt(quote.note, encryptionKey),
                              link: null,
                            },
                          },
                        ],
                        icon: {
                          emoji: "📝",
                        },
                        color: "default",
                      },
                    });
                  }
                  childQuotes.push({
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
                  });

                  childQuotes.push({
                    type: "divider",
                    divider: {},
                  });
                }

                const notionBook = await notion.pages.create({
                  parent: { database_id: notionBooksDatabaseId },
                  cover: {
                    type: "external",
                    external: {
                      url: book.imageUrl || null,
                    },
                  },
                  properties: {
                    Title: {
                      title: [
                        {
                          type: "text",
                          text: {
                            content: book.title || "Untitled",
                          },
                        },
                      ],
                    },
                    Subtitle: {
                      rich_text: [
                        {
                          type: "text",
                          text: {
                            content: book.subtitle || "",
                          },
                        },
                      ],
                    },
                    Author: {
                      rich_text: [
                        {
                          type: "text",
                          text: {
                            content: book.author || "Unknown",
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
                            url: book.imageUrl || null,
                          },
                        },
                      ],
                    },
                    Origin: {
                      rich_text: [
                        {
                          type: "text",
                          text: {
                            content: book.origin || "",
                          },
                        },
                      ],
                    },
                  },
                });

                for (let i = 0; i < childQuotes.length; i += MAX_CHILDREN) {
                  const childBatch = childQuotes.slice(i, i + MAX_CHILDREN);

                  await notion.blocks.children.append({
                    block_id: notionBook.id,
                    children: childBatch,
                  });
                }
              }

              // now check the existing books and add in any quotes that are not there already
              for (const book of booksInNotionAlready) {
                // find the corresponding notion book
                const key = `${book.title} ${book.subtitle}`;

                let matchingNotionBook: {
                  blockId: string;
                  key: string;
                  allQuotePlainText: string[];
                } = { blockId: "", key: "", allQuotePlainText: [] };
                notionBookContentPerBook.forEach((book) => {
                  if (key === book.key) {
                    matchingNotionBook = book;
                    return;
                  }
                });

                let moreQuotesToAdd = [];

                for (const quote of book.quotes) {
                  if (
                    matchingNotionBook.allQuotePlainText.includes(quote.content)
                  ) {
                    continue;
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

                  moreQuotesToAdd.push({
                    type: "quote",
                    quote: {
                      rich_text: [
                        {
                          type: "text",
                          text: {
                            content: quote.content || "No quote...",
                          },
                        },
                      ],
                      color: notionColor,
                      children: [],
                    },
                  });

                  if (quote.note) {
                    moreQuotesToAdd.push({
                      type: "callout",
                      callout: {
                        rich_text: [
                          {
                            type: "text",
                            text: {
                              content: await decrypt(quote.note, encryptionKey),
                              link: null,
                            },
                          },
                        ],
                        icon: {
                          emoji: "📝",
                        },
                        color: "default",
                      },
                    });
                  }

                  moreQuotesToAdd.push({
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
                  });

                  moreQuotesToAdd.push({
                    type: "divider",
                    divider: {},
                  });
                }

                if (moreQuotesToAdd.length > 0) {
                  const response = await notion.blocks.children.append({
                    block_id: matchingNotionBook.blockId,
                    children: moreQuotesToAdd,
                  });
                }
              }
            });
          }
        }

      }
    }
  }
);
