ALTER TABLE "profiles" ADD COLUMN "expired_at" timestamp;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "last_webhook_error" text;