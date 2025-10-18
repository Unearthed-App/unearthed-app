CREATE TABLE IF NOT EXISTS "unearthed_local_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" integer NOT NULL,
	"product_name" text NOT NULL,
	"product_link" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "purchases" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "version" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "distinct_id" text NOT NULL;