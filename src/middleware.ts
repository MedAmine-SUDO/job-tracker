import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware
 *
 * If AUTH_ADAPTER=clerk: Uses Clerk middleware (requires Clerk env vars)
 * If AUTH_ADAPTER=local: Skips auth checks, allows all routes
 *
 * This makes the app work out of the box without Clerk keys.
 */
const PUBLIC_PATHS = ["/sign-in", "/sign-up", "/api/webhook"];

export default async function middleware(request: NextRequest) {
  const authAdapter = process.env.AUTH_ADAPTER || "clerk";

  // Local auth: no middleware checks needed
  if (authAdapter === "local") {
    return NextResponse.next();
  }

  // Clerk auth: protect all routes except public paths
  if (authAdapter === "clerk") {
    try {
      const { clerkMiddleware, createRouteMatcher } = await import(
        "@clerk/nextjs/server"
      );
      const isPublicRoute = createRouteMatcher(
        PUBLIC_PATHS.map((path) => `${path}(.*)`)
      );
      const handler = clerkMiddleware((auth, req) => {
        if (!isPublicRoute(req)) auth().protect();
      });
      return handler(request, {} as any);
    } catch {
      // Clerk misconfigured or unavailable: FAIL CLOSED.
      // Never allow unauthenticated access to a protected app.
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!.*\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
