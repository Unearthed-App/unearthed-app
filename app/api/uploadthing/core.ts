import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth as authClerk, clerkClient } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "128KB" } })
    .middleware(async ({ req }) => {
      const { userId } = authClerk();
      if (!userId) throw new UploadThingError("Unauthorized");

      let isPremium = false;
      try {
        if (userId) {
          const user = await clerkClient().users.getUser(userId);
          isPremium = user.privateMetadata.isPremium as boolean;
        }
      } catch (error) {
        isPremium = false;
      }

      if (!isPremium) throw new UploadThingError("Unauthorized");

      return { userId: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
