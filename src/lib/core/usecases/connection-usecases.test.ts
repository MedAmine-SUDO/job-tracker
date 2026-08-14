import { describe, expect, it, beforeEach } from "vitest";
import {
  Connection,
  CreateConnectionInput,
  UpdateConnectionInput,
} from "@/lib/core/domain/connection";
import { IConnectionRepository } from "@/lib/core/ports/connection-repository";
import { ConnectionUseCases } from "./connection-usecases";

class FakeConnectionRepository implements IConnectionRepository {
  connections = new Map<string, Connection>();

  async findAll(userId: string) {
    return [...this.connections.values()]
      .filter((c) => c.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string, userId: string) {
    const connection = this.connections.get(id);
    return connection && connection.userId === userId ? connection : null;
  }

  async create(userId: string, input: CreateConnectionInput) {
    const now = new Date();
    const connection: Connection = {
      id: `conn-${this.connections.size + 1}`,
      userId,
      name: input.name,
      linkedinUrl: input.linkedinUrl,
      purpose: input.purpose,
      customPurpose: input.customPurpose,
      status: input.status ?? "to_reach_out",
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    };
    this.connections.set(connection.id, connection);
    return connection;
  }

  async update(id: string, userId: string, input: UpdateConnectionInput) {
    const connection = await this.findById(id, userId);
    if (!connection) throw new Error("Connection not found");
    const updated = { ...connection, ...input, updatedAt: new Date() };
    this.connections.set(id, updated);
    return updated;
  }

  async delete(id: string, userId: string) {
    const connection = await this.findById(id, userId);
    if (!connection) throw new Error("Connection not found");
    this.connections.delete(id);
  }
}

describe("ConnectionUseCases", () => {
  let repo: FakeConnectionRepository;
  let useCases: ConnectionUseCases;
  const userId = "user-1";

  beforeEach(() => {
    repo = new FakeConnectionRepository();
    useCases = new ConnectionUseCases(repo);
  });

  describe("createConnection", () => {
    it("creates a connection scoped to the user with default status", async () => {
      const connection = await useCases.createConnection(userId, {
        name: "Sarah Johnson",
        linkedinUrl: "https://www.linkedin.com/in/sarahjohnson",
        purpose: "discuss_opportunity",
      });
      expect(connection.userId).toBe(userId);
      expect(connection.name).toBe("Sarah Johnson");
      expect(connection.status).toBe("to_reach_out");
    });

    it("is not visible to another user", async () => {
      await useCases.createConnection(userId, {
        name: "Sarah Johnson",
        linkedinUrl: "https://www.linkedin.com/in/sarahjohnson",
        purpose: "referral",
      });
      const other = await useCases.listConnections("user-2");
      expect(other).toHaveLength(0);
    });
  });

  describe("getConnection", () => {
    it("returns null for a missing connection", async () => {
      expect(await useCases.getConnection("nope", userId)).toBeNull();
    });

    it("does not return another user's connection", async () => {
      const connection = await useCases.createConnection(userId, {
        name: "Sarah Johnson",
        linkedinUrl: "https://www.linkedin.com/in/sarahjohnson",
        purpose: "look_for_opportunity",
      });
      expect(await useCases.getConnection(connection.id, "user-2")).toBeNull();
    });
  });

  describe("updateConnection", () => {
    it("updates status and custom purpose", async () => {
      const connection = await useCases.createConnection(userId, {
        name: "Sarah Johnson",
        linkedinUrl: "https://www.linkedin.com/in/sarahjohnson",
        purpose: "other",
        customPurpose: "Shared a post about a role",
      });
      const updated = await useCases.updateConnection(connection.id, userId, {
        status: "messaged",
      });
      expect(updated.status).toBe("messaged");
      expect(updated.customPurpose).toBe("Shared a post about a role");
    });

    it("rejects updates to another user's connection", async () => {
      const connection = await useCases.createConnection(userId, {
        name: "Sarah Johnson",
        linkedinUrl: "https://www.linkedin.com/in/sarahjohnson",
        purpose: "apply_for_opportunity",
      });
      await expect(
        useCases.updateConnection(connection.id, "user-2", { status: "replied" })
      ).rejects.toThrow("Connection not found");
    });
  });

  describe("deleteConnection", () => {
    it("deletes a connection the user owns", async () => {
      const connection = await useCases.createConnection(userId, {
        name: "Sarah Johnson",
        linkedinUrl: "https://www.linkedin.com/in/sarahjohnson",
        purpose: "discuss_opportunity",
      });
      await expect(
        useCases.deleteConnection(connection.id, userId)
      ).resolves.toBeUndefined();
      expect(repo.connections.size).toBe(0);
    });

    it("rejects deletion of another user's connection", async () => {
      const connection = await useCases.createConnection(userId, {
        name: "Sarah Johnson",
        linkedinUrl: "https://www.linkedin.com/in/sarahjohnson",
        purpose: "discuss_opportunity",
      });
      await expect(
        useCases.deleteConnection(connection.id, "user-2")
      ).rejects.toThrow("Connection not found");
    });
  });
});
