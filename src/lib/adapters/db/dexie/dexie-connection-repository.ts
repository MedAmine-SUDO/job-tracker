import { IConnectionRepository } from "@/lib/core/ports/connection-repository";
import {
  Connection,
  CreateConnectionInput,
  UpdateConnectionInput,
} from "@/lib/core/domain/connection";
import { db } from "./dexie-client";

/**
 * Dexie Connection Repository
 *
 * Stores connections in the browser's IndexedDB.
 * Zero backend required. Works offline permanently.
 */
export class DexieConnectionRepository implements IConnectionRepository {
  async findAll(userId: string): Promise<Connection[]> {
    const connections = await db.connections
      .where({ userId })
      .toArray();
    return connections.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async findById(id: string, userId: string): Promise<Connection | null> {
    const connection = await db.connections.get(id);
    if (!connection || connection.userId !== userId) return null;
    return connection;
  }

  async create(userId: string, input: CreateConnectionInput): Promise<Connection> {
    const now = new Date();
    const connection: Connection = {
      id: crypto.randomUUID(),
      userId,
      name: input.name,
      linkedinUrl: input.linkedinUrl,
      purpose: input.purpose,
      customPurpose: input.customPurpose,
      status: input.status || "to_reach_out",
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    };
    await db.connections.add(connection);
    return connection;
  }

  async update(id: string, userId: string, input: UpdateConnectionInput): Promise<Connection> {
    const existing = await db.connections.get(id);
    if (!existing || existing.userId !== userId) {
      throw new Error("Connection not found");
    }
    const updated = { ...existing, ...input, updatedAt: new Date() };
    await db.connections.put(updated);
    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    const connection = await db.connections.get(id);
    if (!connection || connection.userId !== userId) return;
    await db.connections.delete(id);
  }
}
