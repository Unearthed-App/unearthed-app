CREATE TABLE IF NOT EXISTS "purchases_mobile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"purchase_id" text NOT NULL,
	"email" text NOT NULL,
	"session_id" text NOT NULL,
	"product_name" text NOT NULL,
	"product_id" text NOT NULL,
	"price_id" text NOT NULL,
	"status" text NOT NULL,
	"validation_success_count" integer DEFAULT 0 NOT NULL,
	"validation_fail_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "purchases_mobile_purchase_id_unique" UNIQUE("purchase_id")
);
