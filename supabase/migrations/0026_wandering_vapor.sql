ALTER TABLE "profiles" ADD COLUMN "ai_input_tokens_used" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "ai_output_tokens_used" integer DEFAULT 0;