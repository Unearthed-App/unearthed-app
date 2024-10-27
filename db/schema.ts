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
    imageUrl: text("image_url"),
    type: text("type"),
    origin: text("origin"),
    userId: text("user_id")
      .default(sql`requesting_user_id()`)
      .notNull(),
    ignored: boolean("ignored").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      uniqueSourceContent: unique("uniqueSourceContent").on(
        table.title,
        table.author,
        table.userId,
        table.type,
        table.origin
      ),
    };
  }
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
  (table) => {
    return {
      uniqueQuoteContent: unique("uniqueQuoteContent").on(
        table.sourceId,
        table.content,
        // table.note,
        table.userId
      ),
    };
  }
);
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .default(sql`requesting_user_id()`)
    .notNull()
    .unique(),
  capacitiesApiKey: text("capacities_api_key"),
  capacitiesSpaceId: text("capacities_space_id"),
  notionDatabaseId: text("notion_database_id"),
  notionAuthData: text("notion_auth_data"),
  utcOffset: integer("utc_offset"),
  userStatus: text("user_status", {
    enum: ["TERMINATED", "PENDING", "ACTIVE"],
  }),
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

// Relations
export const sourcesRelations = relations(sources, ({ many }) => ({
  quotes: many(quotes),
}));

export const quotesRelations = relations(quotes, ({ one }) => ({
  source: one(sources, {
    fields: [quotes.sourceId],
    references: [sources.id],
  }),
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
export const selectSourceWithRelationsSchema = selectSourceSchema.extend({
  quotes: z.array(selectQuoteSchema),
});

export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles, {
  createdAt: z.coerce.date(),
});

export const insertDailyQuotesSchema = createInsertSchema(dailyQuotes);
export const selectDailyQuotesSchema = createSelectSchema(dailyQuotes, {
  day: z.coerce.date(),
});
