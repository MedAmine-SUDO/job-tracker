import {
  Connection,
  CreateConnectionInput,
  UpdateConnectionInput,
} from "@/lib/core/domain/connection";
import { IConnectionRepository } from "@/lib/core/ports/connection-repository";

export class ConnectionUseCases {
  constructor(private repo: IConnectionRepository) {}

  async listConnections(userId: string): Promise<Connection[]> {
    return this.repo.findAll(userId);
  }

  async getConnection(id: string, userId: string): Promise<Connection | null> {
    return this.repo.findById(id, userId);
  }

  async createConnection(
    userId: string,
    input: CreateConnectionInput
  ): Promise<Connection> {
    return this.repo.create(userId, input);
  }

  async updateConnection(
    id: string,
    userId: string,
    input: UpdateConnectionInput
  ): Promise<Connection> {
    return this.repo.update(id, userId, input);
  }

  async deleteConnection(id: string, userId: string): Promise<void> {
    return this.repo.delete(id, userId);
  }
}
