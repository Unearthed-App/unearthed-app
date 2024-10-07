CREATE TABLE IF NOT EXISTS "daily_quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text DEFAULT requesting_user_id() NOT NULL,
	"quote_id" uuid NOT NULL,
	"day" date DEFAULT now(),
	CONSTRAINT "uniqueDailyQuoteContent" UNIQUE("day","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text DEFAULT requesting_user_id() NOT NULL,
	"unearthed_api_key" text,
	"capacities_api_key" text,
	"capacities_space_id" text,
	"utc_offset" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "profiles_unearthed_api_key_unique" UNIQUE("unearthed_api_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"note" text DEFAULT '',
	"color" text,
	"location" text,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"source_id" uuid NOT NULL,
	"user_id" text DEFAULT requesting_user_id() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "uniqueQuoteContent" UNIQUE("source_id","content","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"author" text DEFAULT '',
	"image_url" text,
	"type" text,
	"origin" text,
	"user_id" text DEFAULT requesting_user_id() NOT NULL,
	"ignored" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "uniqueSourceContent" UNIQUE("title","author","user_id","type","origin")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_quotes" ADD CONSTRAINT "daily_quotes_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quotes" ADD CONSTRAINT "quotes_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
