ALTER TABLE "unearthed_local_versions" RENAME COLUMN "product_link" TO "product_link_windows";--> statement-breakpoint
ALTER TABLE "unearthed_local_versions" ADD COLUMN "product_link_mac_intel" text;--> statement-breakpoint
ALTER TABLE "unearthed_local_versions" ADD COLUMN "product_link_mac_silicon" text;--> statement-breakpoint
ALTER TABLE "unearthed_local_versions" ADD COLUMN "product_link_linux" text;