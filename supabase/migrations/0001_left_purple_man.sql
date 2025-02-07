ALTER TABLE "profiles" ADD COLUMN "user_status" text;--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN IF EXISTS "status";