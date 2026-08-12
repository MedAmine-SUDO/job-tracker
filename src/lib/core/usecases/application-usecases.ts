import {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
} from "@/lib/core/domain/application";
import { IApplicationRepository } from "@/lib/core/ports/repository";

export class ApplicationUseCases {
  constructor(private repo: IApplicationRepository) {}

  async listApplications(userId: string): Promise<Application[]> {
    return this.repo.findAll(userId);
  }

  async getApplication(id: string, userId: string): Promise<Application | null> {
    return this.repo.findById(id, userId);
  }

  async createApplication(
    userId: string,
    input: CreateApplicationInput
  ): Promise<Application> {
    return this.repo.create(userId, input);
  }

  async updateApplication(
    id: string,
    userId: string,
    input: UpdateApplicationInput
  ): Promise<Application> {
    return this.repo.update(id, userId, input);
  }

  async deleteApplication(id: string, userId: string): Promise<void> {
    return this.repo.delete(id, userId);
  }

  async searchApplications(userId: string, query: string): Promise<Application[]> {
    return this.repo.search(userId, query);
  }

  async listByStatus(userId: string, status: string): Promise<Application[]> {
    return this.repo.findByStatus(userId, status);
  }

  async listByTags(userId: string, tags: string[]): Promise<Application[]> {
    return this.repo.findByTags(userId, tags);
  }
}
