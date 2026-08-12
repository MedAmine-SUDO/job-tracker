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

export async function middleware(request: NextRequest) {
  const authAdapter = process.env.AUTH_ADAPTER || "clerk";

  // Local auth: no middleware checks needed
  if (authAdapter === "local") {
    return NextResponse.next();
  }

  // Clerk auth: delegate to Clerk (loaded dynamically to avoid errors if not installed)
  if (authAdapter === "clerk") {
    try {
      const { clerkMiddleware } = await import("@clerk/nextjs/server");
      return clerkMiddleware()(request, {} as any);
    } catch {
      // Clerk not configured, fall through to local mode
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};