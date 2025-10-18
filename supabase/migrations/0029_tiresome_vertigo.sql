CREATE TABLE IF NOT EXISTS "purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_name" text NOT NULL,
	"product_id" text NOT NULL,
	"price_id" text NOT NULL,
	"email" text NOT NULL,
	"session_id" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
