-- ALTER TABLE "notion_source_jobs_four" ADD COLUMN "profile_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "notion_source_jobs_four" ADD COLUMN "attempts" integer;--> statement-breakpoint
-- ALTER TABLE "notion_source_jobs_one" ADD COLUMN "profile_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "notion_source_jobs_one" ADD COLUMN "attempts" integer;--> statement-breakpoint
-- ALTER TABLE "notion_source_jobs_three" ADD COLUMN "profile_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "notion_source_jobs_three" ADD COLUMN "attempts" integer;--> statement-breakpoint
-- ALTER TABLE "notion_source_jobs_two" ADD COLUMN "profile_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "notion_source_jobs_two" ADD COLUMN "attempts" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notion_source_jobs_four" ADD CONSTRAINT "notion_source_jobs_four_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notion_source_jobs_one" ADD CONSTRAINT "notion_source_jobs_one_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notion_source_jobs_three" ADD CONSTRAINT "notion_source_jobs_three_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notion_source_jobs_two" ADD CONSTRAINT "notion_source_jobs_two_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
