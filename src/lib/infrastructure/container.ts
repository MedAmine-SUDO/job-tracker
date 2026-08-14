import { IApplicationRepository } from "@/lib/core/ports/repository";
import { IAuthProvider } from "@/lib/core/ports/auth";
import { IStorageProvider } from "@/lib/core/ports/storage";
import { IConnectionRepository } from "@/lib/core/ports/connection-repository";

/**
 * Dependency Injection Container
 *
 * Reads adapter names from environment variables and lazily loads the
 * matching implementation, so business logic never depends on a concrete
 * technology. Swap any adapter without touching application code.
 *
 *   DATABASE_ADAPTER=prisma | dexie
 *   AUTH_ADAPTER=clerk | local
 *   STORAGE_ADAPTER=local | supabase
 */
class Container {
  private _repo: IApplicationRepository | null = null;
  private _connectionRepo: IConnectionRepository | null = null;
  private _auth: IAuthProvider | null = null;
  private _storage: IStorageProvider | null = null;

  async getRepository(): Promise<IApplicationRepository> {
    if (this._repo) return this._repo;

    const adapter = process.env.DATABASE_ADAPTER || "prisma";
    switch (adapter) {
      case "dexie": {
        const { DexieApplicationRepository } = await import(
          "@/lib/adapters/db/dexie/dexie-repository"
        );
        this._repo = new DexieApplicationRepository();
        break;
      }
      case "prisma":
      default: {
        const { PrismaApplicationRepository } = await import(
          "@/lib/adapters/db/prisma/prisma-repository"
        );
        this._repo = new PrismaApplicationRepository();
        break;
      }
    }

    return this._repo;
  }

  async getConnectionRepository(): Promise<IConnectionRepository> {
    if (this._connectionRepo) return this._connectionRepo;

    const adapter = process.env.DATABASE_ADAPTER || "prisma";
    switch (adapter) {
      case "dexie": {
        const { DexieConnectionRepository } = await import(
          "@/lib/adapters/db/dexie/dexie-connection-repository"
        );
        this._connectionRepo = new DexieConnectionRepository();
        break;
      }
      case "prisma":
      default: {
        const { PrismaConnectionRepository } = await import(
          "@/lib/adapters/db/prisma/prisma-connection-repository"
        );
        this._connectionRepo = new PrismaConnectionRepository();
        break;
      }
    }

    return this._connectionRepo;
  }

  async getAuth(): Promise<IAuthProvider> {
    if (this._auth) return this._auth;

    const adapter = process.env.AUTH_ADAPTER || "clerk";
    switch (adapter) {
      case "local": {
        const { LocalAuthProvider } = await import(
          "@/lib/adapters/auth/local/local-auth"
        );
        this._auth = new LocalAuthProvider();
        break;
      }
      case "clerk":
      default: {
        const { ClerkAuthProvider } = await import(
          "@/lib/adapters/auth/clerk/clerk-auth"
        );
        this._auth = new ClerkAuthProvider();
        break;
      }
    }

    return this._auth;
  }

  async getStorage(): Promise<IStorageProvider> {
    if (this._storage) return this._storage;

    const adapter = process.env.STORAGE_ADAPTER || "local";
    switch (adapter) {
      case "local":
      default: {
        const { LocalStorageProvider } = await import(
          "@/lib/adapters/storage/local/local-storage"
        );
        this._storage = new LocalStorageProvider();
        break;
      }
    }

    return this._storage;
  }
}

export const container = new Container();
