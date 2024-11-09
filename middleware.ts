import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

// Routes that don't need any protection
const allowedRoutes = createRouteMatcher([
  "/api/webhooks/(.*)",
  "/api/public/(.*)",
  "/api/uploadthing(.*)",
]);

// Routes that need basic auth
const protectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/(.*)"]);

// Routes that need premium status
const premiumRoute = createRouteMatcher([
  "/premium/(.*)", // Matches any route starting with /premium/
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId }: { userId: string | null } = auth();

  let isPremium = false;
  try {
    if (userId) {
      const user = await clerkClient().users.getUser(userId);
      isPremium = user.privateMetadata.isPremium as boolean;
    }
  } catch (error) {
    isPremium = false;
  }

  // Allow webhook routes without protection
  if (allowedRoutes(req)) {
    return;
  }

  // Check premium routes first
  if (premiumRoute(req)) {
    // Protect the route (ensures user is logged in)
    auth().protect();

    // If user is not premium, throw an error
    if (!isPremium) {
      throw new Error("Premium subscription required");
    }
    return;
  }

  // Apply normal protection to other protected routes
  if (protectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.*(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/api/(.*)",
  ],
};
