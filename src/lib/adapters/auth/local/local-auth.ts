import { IAuthProvider, AuthUser } from "@/lib/core/ports/auth";

/**
 * Local Auth Provider
 * 
 * No external auth service needed. Generates a persistent user ID
 * stored in localStorage. Perfect for:
 * - Development without Clerk keys
 * - Offline-first mode
 * - Users who don't want cloud auth
 * 
 * To enable: set AUTH_ADAPTER=local
 */
const LOCAL_USER_ID_KEY = "job-tracker-user-id";
const LOCAL_USER_NAME_KEY = "job-tracker-user-name";

export class LocalAuthProvider implements IAuthProvider {
  private getUserId(): string {
    if (typeof window === "undefined") return "server-user";
    let id = localStorage.getItem(LOCAL_USER_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(LOCAL_USER_ID_KEY, id);
    }
    return id;
  }

  async getCurrentUserId(): Promise<string | null> {
    return this.getUserId();
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    if (typeof window === "undefined") return { id: "server-user" };
    return {
      id: this.getUserId(),
      name: localStorage.getItem(LOCAL_USER_NAME_KEY) || "Local User",
    };
  }

  async isAuthenticated(): Promise<boolean> {
    return true; // Always "authenticated" in local mode
  }

  async requireAuth(): Promise<string> {
    return this.getUserId();
  }
}
