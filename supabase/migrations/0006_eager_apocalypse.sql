ALTER TABLE "profiles" ADD COLUMN "stripe_subscription_id" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "stripe_price_id" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "stripe_created_timestamp" integer;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "stripe_expire_timestamp" integer;