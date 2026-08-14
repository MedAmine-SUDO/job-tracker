import { IConnectionRepository } from "@/lib/core/ports/connection-repository";
import {
  Connection,
  CreateConnectionInput,
  UpdateConnectionInput,
} from "@/lib/core/domain/connection";
import { prisma } from "./prisma-client";

/**
 * Prisma Connection Repository
 *
 * Works with ANY PostgreSQL provider. Just change DATABASE_URL.
 */
export class PrismaConnectionRepository implements IConnectionRepository {
  async findAll(userId: string): Promise<Connection[]> {
    const connections = await prisma.connection.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return connections.map(this.mapToDomain);
  }

  async findById(id: string, userId: string): Promise<Connection | null> {
    const connection = await prisma.connection.findFirst({ where: { id, userId } });
    return connection ? this.mapToDomain(connection) : null;
  }

  async create(userId: string, input: CreateConnectionInput): Promise<Connection> {
    const connection = await prisma.connection.create({
      data: {
        userId,
        name: input.name,
        linkedinUrl: input.linkedinUrl,
        purpose: input.purpose,
        customPurpose: input.customPurpose,
        status: input.status || "to_reach_out",
        notes: input.notes,
      },
    });
    return this.mapToDomain(connection);
  }

  async update(id: string, userId: string, input: UpdateConnectionInput): Promise<Connection> {
    const existing = await prisma.connection.findFirst({ where: { id, userId } });
    if (!existing) throw new Error("Connection not found");

    const connection = await prisma.connection.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.linkedinUrl !== undefined && { linkedinUrl: input.linkedinUrl }),
        ...(input.purpose !== undefined && { purpose: input.purpose }),
        ...(input.customPurpose !== undefined && { customPurpose: input.customPurpose }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.notes !== undefined && { notes: input.notes }),
      },
    });
    return this.mapToDomain(connection);
  }

  async delete(id: string, userId: string): Promise<void> {
    const existing = await prisma.connection.findFirst({ where: { id, userId } });
    if (!existing) throw new Error("Connection not found");
    await prisma.connection.delete({ where: { id } });
  }

  private mapToDomain(raw: any): Connection {
    return {
      ...raw,
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
    };
  }
}
