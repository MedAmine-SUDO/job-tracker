import {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
} from "@/lib/core/domain/application";

export interface IApplicationRepository {
  findAll(userId: string): Promise<Application[]>;
  findById(id: string, userId: string): Promise<Application | null>;
  create(userId: string, input: CreateApplicationInput): Promise<Application>;
  update(id: string, userId: string, input: UpdateApplicationInput): Promise<Application>;
  delete(id: string, userId: string): Promise<void>;
  search(userId: string, query: string): Promise<Application[]>;
  findByStatus(userId: string, status: string): Promise<Application[]>;
  findByTags(userId: string, tags: string[]): Promise<Application[]>;
}
