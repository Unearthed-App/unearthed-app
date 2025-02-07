ALTER TABLE "sources" RENAME COLUMN "qmedia_id" TO "media_id";--> statement-breakpoint
ALTER TABLE "sources" DROP CONSTRAINT "sources_qmedia_id_media_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sources" ADD CONSTRAINT "sources_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
