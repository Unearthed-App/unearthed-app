/**
 * Copyright (C) 2025 Unearthed App
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

import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const sources = pgTable(
  "sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    author: text("author").default(""),
    type: text("type"),
    origin: text("origin"),
    asin: text("asin"),
    mediaId: uuid("media_id").references(() => media.id),
    userId: text("user_id")
      .default(sql`requesting_user_id()`)
      .notNull(),
    ignored: boolean("ignored").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    unique("uniqueSourceContent").on(
      table.title,
      table.author,
      table.userId,
      table.type
      // table.origin
    ),
  ]
);

export const quotes = pgTable(
  "quotes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    content: text("content").notNull(),
    note: text("note").default(""), // Default empty string instead of allowing null
    color: text("color"),
    location: text("location"),
    sourceId: uuid("source_id")
      .references(() => sources.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .default(sql`requesting_user_id()`)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    unique("uniqueQuoteContent").on(
      table.sourceId,
      table.content,
      table.userId
    ),
  ]
);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .default(sql`requesting_user_id()`)
    .notNull()
    .unique(),
  dailyEmails: boolean("daily_emails").default(false),
  supernotesApiKey: text("supernotes_api_key"),
  aiApiKey: text("ai_api_key"),
  aiApiUrl: text("ai_url"),
  aiApiModel: text("ai_model"),
  capacitiesApiKey: text("capacities_api_key"),
  capacitiesSpaceId: text("capacities_space_id"),
  notionDatabaseId: text("notion_database_id"),
  notionAuthData: text("notion_auth_data"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeCreatedTimestamp: integer("stripe_created_timestamp"),
  stripeExpireTimestamp: integer("stripe_expire_timestamp"),
  utcOffset: integer("utc_offset"),
  userStatus: text("user_status", {
    enum: ["TERMINATED", "PENDING", "ACTIVE"],
  }),
  createdAt: timestamp("created_at").defaultNow(),
  expiredAt: timestamp("expired_at"),
  lastWebhookError: text("last_webhook_error"),
  aiInputTokensUsed: integer("ai_input_tokens_used").default(0),
  aiOutputTokensUsed: integer("ai_output_tokens_used").default(0),
});

export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  appUrl: text("app_url"),
  key: text("key"),
  name: text("name"),
  uploadedBy: text("uploaded_by"),
  url: text("url"),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyQuotes = pgTable(
  "daily_quotes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .default(sql`requesting_user_id()`)
      .notNull(),
    quoteId: uuid("quote_id")
      .references(() => quotes.id)
      .notNull(),
    day: date("day").defaultNow(),
    emailSent: boolean("email_sent").default(false),
    capacitiesUpdated: boolean("capacities_updated").default(false),
    supernotesUpdated: boolean("supernotes_updated").default(false),
  },
  (table) => {
    return {
      uniqueDailyQuoteContent: unique("uniqueDailyQuoteContent").on(
        table.day,
        table.userId
      ),
    };
  }
);

export const unearthedKeys = pgTable("unearthed_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .default(sql`requesting_user_id()`)
    .notNull(),
  key: text("key").notNull().unique(),
  name: text("name"),
});

export const notionSourceJobsOne = pgTable("notion_source_jobs_one", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceId: uuid("source_id")
    .references(() => sources.id)
    .notNull(),
  profileId: uuid("profile_id")
    .references(() => profiles.id)
    .notNull(),
  status: text("status"),
  attempts: integer("attempts"),
  newConnection: boolean("new_connection").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notionSourceJobsTwo = pgTable("notion_source_jobs_two", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceId: uuid("source_id")
    .references(() => sources.id)
    .notNull(),
  profileId: uuid("profile_id")
    .references(() => profiles.id)
    .notNull(),

  status: text("status"),
  attempts: integer("attempts"),
  newConnection: boolean("new_connection").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notionSourceJobsThree = pgTable("notion_source_jobs_three", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceId: uuid("source_id")
    .references(() => sources.id)
    .notNull(),
  profileId: uuid("profile_id")
    .references(() => profiles.id)
    .notNull(),

  status: text("status"),
  attempts: integer("attempts"),
  newConnection: boolean("new_connection").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notionSourceJobsFour = pgTable("notion_source_jobs_four", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceId: uuid("source_id")
    .references(() => sources.id)
    .notNull(),
  profileId: uuid("profile_id")
    .references(() => profiles.id)
    .notNull(),
  status: text("status"),
  attempts: integer("attempts"),
  newConnection: boolean("new_connection").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .default(sql`requesting_user_id()`)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sourceTags = pgTable("source_tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .default(sql`requesting_user_id()`)
    .notNull(),
  sourceId: uuid("source_id")
    .notNull()
    .references(() => sources.id),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id),
});

export const quoteTags = pgTable("quote_tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .default(sql`requesting_user_id()`)
    .notNull(),
  quoteId: uuid("quote_id")
    .notNull()
    .references(() => quotes.id),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id),
});


export const purchases = pgTable("purchases", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  version: integer("version").notNull(),
  productName: text("product_name").notNull(),
  productId: text("product_id").notNull(),
  priceId: text("price_id").notNull(),
  email: text("email").notNull(),
  sessionId: text("session_id").notNull(),
  distinctId: text("distinct_id").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const unearthedLocalVersions = pgTable("unearthed_local_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  version: integer("version").notNull(),
  productName: text("product_name").notNull(),
  productLinkWindows: text("product_link_windows"),
  productLinkMacIntel: text("product_link_mac_intel"),
  productLinkMacSilicon: text("product_link_mac_silicon"),
  productLinkLinux: text("product_link_linux"),
  productLinkLinuxRpm: text("product_link_linux_rpm"),
  createdAt: timestamp("created_at").defaultNow(),
  changes: text("changes"),
});

// Relations
export const sourcesRelations = relations(sources, ({ many, one }) => ({
  quotes: many(quotes),
  media: one(media, {
    fields: [sources.mediaId],
    references: [media.id],
  }),
  tags: many(sourceTags),
}));

export const quotesRelations = relations(quotes, ({ many, one }) => ({
  source: one(sources, {
    fields: [quotes.sourceId],
    references: [sources.id],
  }),
  tags: many(quoteTags),
}));

export const dailyQuotesRelations = relations(dailyQuotes, ({ one }) => ({
  quote: one(quotes, {
    fields: [dailyQuotes.quoteId],
    references: [quotes.id],
  }),
}));

export const notionSourceJobsOneRelations = relations(
  notionSourceJobsOne,
  ({ one }) => ({
    source: one(sources, {
      fields: [notionSourceJobsOne.sourceId],
      references: [sources.id],
    }),
    profile: one(profiles, {
      fields: [notionSourceJobsOne.profileId],
      references: [profiles.id],
    }),
  })
);

export const notionSourceJobsTwoRelations = relations(
  notionSourceJobsTwo,
  ({ one }) => ({
    source: one(sources, {
      fields: [notionSourceJobsTwo.sourceId],
      references: [sources.id],
    }),
    profile: one(profiles, {
      fields: [notionSourceJobsTwo.profileId],
      references: [profiles.id],
    }),
  })
);

export const notionSourceJobsThreeRelations = relations(
  notionSourceJobsThree,
  ({ one }) => ({
    source: one(sources, {
      fields: [notionSourceJobsThree.sourceId],
      references: [sources.id],
    }),
    profile: one(profiles, {
      fields: [notionSourceJobsThree.profileId],
      references: [profiles.id],
    }),
  })
);

export const notionSourceJobsFourRelations = relations(
  notionSourceJobsFour,
  ({ one }) => ({
    source: one(sources, {
      fields: [notionSourceJobsFour.sourceId],
      references: [sources.id],
    }),
    profile: one(profiles, {
      fields: [notionSourceJobsFour.profileId],
      references: [profiles.id],
    }),
  })
);

export const sourceTagsRelations = relations(sourceTags, ({ one }) => ({
  source: one(sources, {
    fields: [sourceTags.sourceId],
    references: [sources.id],
  }),
  tag: one(tags, {
    fields: [sourceTags.tagId],
    references: [tags.id],
  }),
}));

// Types for zod
export const insertNotionSourceJobsOneSchema =
  createInsertSchema(notionSourceJobsOne);
export const selectNotionSourceJobsOneSchema = createSelectSchema(
  notionSourceJobsOne,
  {
    createdAt: z.coerce.date(),
  }
);

export const insertNotionSourceJobsTwoSchema =
  createInsertSchema(notionSourceJobsTwo);
export const selectNotionSourceJobsTwoSchema = createSelectSchema(
  notionSourceJobsTwo,
  {
    createdAt: z.coerce.date(),
  }
);

export const insertNotionSourceJobsThreeSchema = createInsertSchema(
  notionSourceJobsThree
);
export const selectNotionSourceJobsThreeSchema = createSelectSchema(
  notionSourceJobsThree,
  {
    createdAt: z.coerce.date(),
  }
);

export const insertNotionSourceJobsFourSchema =
  createInsertSchema(notionSourceJobsFour);
export const selectNotionSourceJobsFourSchema = createSelectSchema(
  notionSourceJobsFour,
  {
    createdAt: z.coerce.date(),
  }
);

export const insertUnearthedKeySchema = createInsertSchema(unearthedKeys);
export const selectUnearthedKeySchema = createSelectSchema(unearthedKeys);

export const insertPurchasesSchema = createInsertSchema(purchases);
export const selectPurchasesSchema = createSelectSchema(purchases);


export const insertSourceSchema = createInsertSchema(sources);
export const insertQuoteSchema = createInsertSchema(quotes);

export const selectSourceSchema = createSelectSchema(sources, {
  createdAt: z.coerce.date(),
});

export const selectQuoteSchema = createSelectSchema(quotes, {
  createdAt: z.coerce.date(),
});
export const selectQuoteWithRelationsSchema = selectQuoteSchema.extend({
  source: selectSourceSchema,
});

export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles, {
  createdAt: z.coerce.date(),
});

export const insertDailyQuotesSchema = createInsertSchema(dailyQuotes);
export const selectDailyQuotesSchema = createSelectSchema(dailyQuotes, {
  day: z.coerce.date(),
});

export const insertMediaSchema = createInsertSchema(media);
export const selectMediaSchema = createSelectSchema(media, {
  createdAt: z.coerce.date(),
});

export const insertTagSchema = createInsertSchema(tags);
export const selectTagSchema = createSelectSchema(tags, {
  createdAt: z.coerce.date(),
});

export const insertSourceTagSchema = createInsertSchema(sourceTags);
export const selectSourceTagSchema = createSelectSchema(sourceTags);

export const selectSourceWithRelationsSchema = selectSourceSchema.extend({
  quotes: z.array(selectQuoteSchema),
  media: selectMediaSchema.nullable(),
});

export const selectMediaWithRelationsSchema = selectMediaSchema.extend({
  sources: z.array(selectSourceSchema),
});
