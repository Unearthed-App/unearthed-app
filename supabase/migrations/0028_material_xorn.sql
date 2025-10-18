ALTER TABLE "sources" DROP CONSTRAINT "uniqueSourceContent";--> statement-breakpoint
ALTER TABLE "sources" ADD CONSTRAINT "uniqueSourceContent" UNIQUE("title","author","user_id","type");