import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/admin(.*)",
  "/check(.*)",
  "/sso-callback(.*)",
  "/api/webhooks(.*)",
  "/api/telemetry(.*)",
  "/api/download(.*)",
]);

const isAuthRoute = createRouteMatcher(["/", "/login"]);

export default clerkMiddleware(
  async (auth, req) => {
    const { userId } = await auth();
    const loggedInCookie = req.cookies.get("klaro_logged_in")?.value;

    if ((userId || loggedInCookie === "true") && isAuthRoute(req)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (!isPublicRoute(req)) {
      if (userId || loggedInCookie === "true") {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    signInUrl: "/login",
    signUpUrl: "/login",
  }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
