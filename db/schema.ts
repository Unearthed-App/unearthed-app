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

export const books = pgTable(
  "books",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    author: text("author").default(""),
    imageUrl: text("image_url"),
    status: text("status", { enum: ["PENDING", "ACTIVE"] })
      .notNull()
      .default("PENDING"),
    userId: text("user_id")
      .default(sql`requesting_user_id()`)
      .notNull(),
    ignored: boolean("ignored").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      uniqueBookContent: unique("uniqueBookContent").on(
        table.title,
        table.author,
        table.status,
        table.userId
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
    status: text("status", { enum: ["PENDING", "ACTIVE"] })
      .notNull()
      .default("ACTIVE"),
    bookId: uuid("book_id")
      .references(() => books.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .default(sql`requesting_user_id()`)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      uniqueQuoteContent: unique("uniqueQuoteContent").on(
        table.bookId,
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
  unearthedApiKey: text("unearthed_api_key").unique(),
  capacitiesApiKey: text("capacities_api_key"),
  capacitiesSpaceId: text("capacities_space_id"),
  utcOffset: integer("utc_offset"),
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
      .references(() => quotes.id, { onDelete: "cascade" })
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

// Relations
export const booksRelations = relations(books, ({ many }) => ({
  quotes: many(quotes),
}));

export const quotesRelations = relations(quotes, ({ one }) => ({
  book: one(books, {
    fields: [quotes.bookId],
    references: [books.id],
  }),
}));

export const dailyQuotesRelations = relations(dailyQuotes, ({ one }) => ({
  quote: one(quotes, {
    fields: [dailyQuotes.quoteId],
    references: [quotes.id],
  }),
}));

// Types for zod
export const insertBookSchema = createInsertSchema(books);
export const insertQuoteSchema = createInsertSchema(quotes);

export const selectBookSchema = createSelectSchema(books, {
  createdAt: z.coerce.date(),
});

export const selectQuoteSchema = createSelectSchema(quotes, {
  createdAt: z.coerce.date(),
});
export const selectQuoteWithRelationsSchema = selectQuoteSchema.extend({
  book: selectBookSchema,
});
export const selectBookWithRelationsSchema = selectBookSchema.extend({
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
