export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
}

export interface IAuthProvider {
  getCurrentUserId(): Promise<string | null>;
  getCurrentUser(): Promise<AuthUser | null>;
  isAuthenticated(): Promise<boolean>;
  requireAuth(): Promise<string>;
}
