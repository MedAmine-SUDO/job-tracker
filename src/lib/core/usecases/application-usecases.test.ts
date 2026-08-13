import { describe, expect, it, beforeEach } from "vitest";
import {
  Application,
  Attachment,
  CreateApplicationInput,
  CreateAttachmentInput,
  UpdateApplicationInput,
} from "@/lib/core/domain/application";
import { IApplicationRepository } from "@/lib/core/ports/repository";
import { IStorageProvider } from "@/lib/core/ports/storage";
import { ApplicationUseCases } from "./application-usecases";

class FakeStorageProvider implements IStorageProvider {
  uploads: { file: unknown; path: string }[] = [];
  nextUpload = { url: "data:application/pdf;base64,AAAA", size: 4 };

  async upload(file: File | Buffer, path: string) {
    this.uploads.push({ file, path });
    return { ...this.nextUpload };
  }

  async delete(_url: string) {}
}

class FakeApplicationRepository implements IApplicationRepository {
  apps = new Map<string, Application>();
  attachments = new Map<string, Attachment>();
  addCalls: { applicationId: string; input: CreateAttachmentInput }[] = [];

  async findAll(userId: string) {
    return [...this.apps.values()].filter((a) => a.userId === userId);
  }

  async findById(id: string, userId: string) {
    const app = this.apps.get(id);
    return app && app.userId === userId ? app : null;
  }

  async create(userId: string, input: CreateApplicationInput) {
    const app: Application = {
      id: `app-${this.apps.size + 1}`,
      userId,
      companyName: input.companyName,
      positionTitle: input.positionTitle,
      status: input.status ?? "applied",
      applicationDate: input.applicationDate ?? new Date(),
      salaryCurrency: input.salaryCurrency ?? "USD",
      workType: input.workType ?? "unknown",
      tags: input.tags ?? [],
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.apps.set(app.id, app);
    return app;
  }

  async update(id: string, userId: string, input: UpdateApplicationInput) {
    const app = await this.findById(id, userId);
    if (!app) throw new Error("Application not found");
    const updated = { ...app, ...input, updatedAt: new Date() };
    this.apps.set(id, updated);
    return updated;
  }

  async delete(id: string, userId: string) {
    const app = await this.findById(id, userId);
    if (!app) throw new Error("Application not found");
    this.apps.delete(id);
  }

  async search(userId: string, query: string) {
    return (await this.findAll(userId)).filter(
      (a) =>
        a.companyName.toLowerCase().includes(query.toLowerCase()) ||
        a.positionTitle.toLowerCase().includes(query.toLowerCase())
    );
  }

  async findByStatus(userId: string, status: string) {
    return (await this.findAll(userId)).filter((a) => a.status === status);
  }

  async findByTags(userId: string, tags: string[]) {
    return (await this.findAll(userId)).filter((a) =>
      tags.every((t) => a.tags.includes(t))
    );
  }

  async addAttachment(
    applicationId: string,
    userId: string,
    input: CreateAttachmentInput
  ) {
    const app = await this.findById(applicationId, userId);
    if (!app) throw new Error("Application not found");
    this.addCalls.push({ applicationId, input });
    const attachment: Attachment = {
      id: `att-${this.attachments.size + 1}`,
      applicationId,
      fileName: input.fileName,
      fileUrl: input.fileUrl,
      fileType: input.fileType,
      fileSize: input.fileSize,
      category: input.category,
      uploadedAt: new Date(),
    };
    this.attachments.set(attachment.id, attachment);
    return attachment;
  }

  async deleteAttachment(
    applicationId: string,
    userId: string,
    attachmentId: string
  ) {
    const app = await this.findById(applicationId, userId);
    if (!app) throw new Error("Application not found");
    const attachment = this.attachments.get(attachmentId);
    if (!attachment || attachment.applicationId !== applicationId) {
      throw new Error("Attachment not found");
    }
    this.attachments.delete(attachmentId);
  }
}

function makeFile(name: string, type: string): File {
  return new File(["test"], name, { type });
}

describe("ApplicationUseCases", () => {
  let repo: FakeApplicationRepository;
  let storage: FakeStorageProvider;
  let useCases: ApplicationUseCases;
  const userId = "user-1";

  beforeEach(() => {
    repo = new FakeApplicationRepository();
    storage = new FakeStorageProvider();
    useCases = new ApplicationUseCases(repo, storage);
  });

  describe("createApplication", () => {
    it("creates an application scoped to the user", async () => {
      const app = await useCases.createApplication(userId, {
        companyName: "Acme",
        positionTitle: "Engineer",
      });
      expect(app.userId).toBe(userId);
      expect(app.status).toBe("applied");
      expect(app.companyName).toBe("Acme");
    });

    it("is not visible to another user", async () => {
      await useCases.createApplication(userId, {
        companyName: "Acme",
        positionTitle: "Engineer",
      });
      const other = await useCases.listApplications("user-2");
      expect(other).toHaveLength(0);
    });
  });

  describe("getApplication", () => {
    it("returns null for a missing application", async () => {
      expect(await useCases.getApplication("nope", userId)).toBeNull();
    });

    it("does not return another user's application", async () => {
      const app = await useCases.createApplication(userId, {
        companyName: "Acme",
        positionTitle: "Engineer",
      });
      expect(await useCases.getApplication(app.id, "user-2")).toBeNull();
    });
  });

  describe("uploadAttachment", () => {
    it("stores the file through the storage port and attaches it", async () => {
      const app = await useCases.createApplication(userId, {
        companyName: "Acme",
        positionTitle: "Engineer",
      });
      const file = makeFile("resume.pdf", "application/pdf");

      const attachment = await useCases.uploadAttachment(app.id, userId, file, "resume");

      expect(storage.uploads).toHaveLength(1);
      expect(storage.uploads[0].path).toBe("resume.pdf");
      expect(repo.addCalls[0].input).toMatchObject({
        fileName: "resume.pdf",
        fileUrl: storage.nextUpload.url,
        fileType: "application/pdf",
        category: "resume",
      });
      expect(attachment.applicationId).toBe(app.id);
    });

    it("rejects uploads for applications owned by someone else", async () => {
      const app = await useCases.createApplication(userId, {
        companyName: "Acme",
        positionTitle: "Engineer",
      });
      const file = makeFile("resume.pdf", "application/pdf");
      await expect(
        useCases.uploadAttachment(app.id, "user-2", file, "resume")
      ).rejects.toThrow("Application not found");
    });
  });

  describe("deleteAttachment", () => {
    it("deletes an attachment the user owns", async () => {
      const app = await useCases.createApplication(userId, {
        companyName: "Acme",
        positionTitle: "Engineer",
      });
      const attachment = await useCases.uploadAttachment(
        app.id,
        userId,
        makeFile("resume.pdf", "application/pdf"),
        "resume"
      );

      await expect(
        useCases.deleteAttachment(app.id, userId, attachment.id)
      ).resolves.toBeUndefined();
      expect(repo.attachments.size).toBe(0);
    });

    it("rejects deletion of another user's attachment", async () => {
      const app = await useCases.createApplication(userId, {
        companyName: "Acme",
        positionTitle: "Engineer",
      });
      const attachment = await useCases.uploadAttachment(
        app.id,
        userId,
        makeFile("resume.pdf", "application/pdf"),
        "resume"
      );

      await expect(
        useCases.deleteAttachment(app.id, "user-2", attachment.id)
      ).rejects.toThrow("Application not found");
    });
  });
});
