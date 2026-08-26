import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// All public routes that don't require auth
const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/admin(.*)",
  "/sso-callback(.*)",
  "/api/webhooks(.*)",
  "/__clerk(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // 1. Ensure Clerk JS proxy requests are handled
    "/__clerk(.*)",
    // 2. Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // 3. Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
