import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const allowedWebhookRoute = createRouteMatcher([
  "/api/webhooks/(.*)",
  "/api/public/(.*)",
]);
const protectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/premium(.*)",
  "/api/(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // Check if the route is specifically allowed (no protection needed)
  if (allowedWebhookRoute(req)) {
    return;
  }

  // Apply protection to all other protected routes
  if (protectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/api/(.*)",
  ],
};
