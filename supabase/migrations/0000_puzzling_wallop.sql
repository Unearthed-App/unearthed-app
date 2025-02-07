CREATE TABLE IF NOT EXISTS "daily_quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text DEFAULT requesting_user_id() NOT NULL,
	"quote_id" uuid NOT NULL,
	"day" date DEFAULT now(),
	CONSTRAINT "uniqueDailyQuoteContent" UNIQUE("day","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notion_source_jobs_four" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"status" text,
	"new_connection" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notion_source_jobs_one" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"status" text,
	"new_connection" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notion_source_jobs_three" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"status" text,
	"new_connection" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notion_source_jobs_two" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"status" text,
	"new_connection" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text DEFAULT requesting_user_id() NOT NULL,
	"capacities_api_key" text,
	"capacities_space_id" text,
	"notion_database_id" text,
	"notion_auth_data" text,
	"utc_offset" integer,
	"status" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"note" text DEFAULT '',
	"color" text,
	"location" text,
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
CREATE TABLE IF NOT EXISTS "unearthed_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text DEFAULT requesting_user_id() NOT NULL,
	"key" text NOT NULL,
	"name" text,
	CONSTRAINT "unearthed_keys_key_unique" UNIQUE("key")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_quotes" ADD CONSTRAINT "daily_quotes_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notion_source_jobs_four" ADD CONSTRAINT "notion_source_jobs_four_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notion_source_jobs_one" ADD CONSTRAINT "notion_source_jobs_one_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notion_source_jobs_three" ADD CONSTRAINT "notion_source_jobs_three_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notion_source_jobs_two" ADD CONSTRAINT "notion_source_jobs_two_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quotes" ADD CONSTRAINT "quotes_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
