import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// All public routes that don't require auth
const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/admin(.*)",
  "/check(.*)",
  "/sso-callback(.*)",
  "/api/webhooks(.*)",
]);

const isAuthRoute = createRouteMatcher(["/", "/login"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const loggedInCookie = req.cookies.get("klaro_logged_in")?.value;

  // If user is already authenticated (via Clerk or cookie) and visits "/" or "/login", redirect to "/dashboard"
  if ((userId || loggedInCookie === "true") && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

