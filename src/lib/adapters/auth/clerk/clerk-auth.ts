import { IAuthProvider, AuthUser } from "@/lib/core/ports/auth";
import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Clerk Auth Provider
 * 
 * Production-ready auth with OAuth, MFA, session management.
 * To enable: set AUTH_ADAPTER=clerk (default)
 */
export class ClerkAuthProvider implements IAuthProvider {
  async getCurrentUserId(): Promise<string | null> {
    const { userId } = auth();
    return userId || null;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const user = await currentUser();
    if (!user) return null;
    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || undefined,
      avatarUrl: user.imageUrl,
    };
  }

  async isAuthenticated(): Promise<boolean> {
    const { userId } = auth();
    return !!userId;
  }

  async requireAuth(): Promise<string> {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    return userId;
  }
}
