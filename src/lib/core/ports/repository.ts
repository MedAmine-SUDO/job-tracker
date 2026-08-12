import {
  Application,
  Attachment,
  CreateApplicationInput,
  CreateAttachmentInput,
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
  addAttachment(
    applicationId: string,
    userId: string,
    input: CreateAttachmentInput
  ): Promise<Attachment>;
  deleteAttachment(
    applicationId: string,
    userId: string,
    attachmentId: string
  ): Promise<void>;
}
