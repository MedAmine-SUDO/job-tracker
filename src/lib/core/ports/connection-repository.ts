import {
  Connection,
  CreateConnectionInput,
  UpdateConnectionInput,
} from "@/lib/core/domain/connection";

export interface IConnectionRepository {
  findAll(userId: string): Promise<Connection[]>;
  findById(id: string, userId: string): Promise<Connection | null>;
  create(userId: string, input: CreateConnectionInput): Promise<Connection>;
  update(id: string, userId: string, input: UpdateConnectionInput): Promise<Connection>;
  delete(id: string, userId: string): Promise<void>;
}
