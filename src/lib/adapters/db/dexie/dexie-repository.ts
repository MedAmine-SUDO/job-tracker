import { IApplicationRepository } from "@/lib/core/ports/repository";
import { Application, CreateApplicationInput, UpdateApplicationInput } from "@/lib/core/domain/application";
import { db } from "./dexie-client";

/**
 * Dexie Application Repository
 * 
 * Stores everything in the browser's IndexedDB.
 * Zero backend required. Works offline permanently.
 * 
 * To enable: set DATABASE_ADAPTER=dexie in .env.local
 */
export class DexieApplicationRepository implements IApplicationRepository {
  async findAll(userId: string): Promise<Application[]> {
    const apps = await db.applications
      .where({ userId })
      .filter((a) => !a.isArchived)
      .reverse()
      .sortBy("createdAt");
    return Promise.all(apps.map((a) => this.enrich(a)));
  }

  async findById(id: string, userId: string): Promise<Application | null> {
    const app = await db.applications.get(id);
    if (!app || app.userId !== userId) return null;
    return this.enrich(app);
  }

  async create(userId: string, input: CreateApplicationInput): Promise<Application> {
    const now = new Date();
    const app: Application = {
      id: crypto.randomUUID(),
      userId,
      companyName: input.companyName,
      positionTitle: input.positionTitle,
      status: input.status || "applied",
      applicationDate: input.applicationDate || now,
      jobPostingUrl: input.jobPostingUrl,
      jobDescriptionText: input.jobDescriptionText,
      salaryRangeMin: input.salaryRangeMin,
      salaryRangeMax: input.salaryRangeMax,
      salaryCurrency: input.salaryCurrency || "USD",
      location: input.location,
      workType: input.workType || "unknown",
      source: input.source,
      tags: input.tags || [],
      notes: input.notes,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    };
    await db.applications.add(app);
    return app;
  }

  async update(id: string, userId: string, input: UpdateApplicationInput): Promise<Application> {
    const existing = await db.applications.get(id);
    if (!existing || existing.userId !== userId) {
      throw new Error("Application not found");
    }
    const updated = { ...existing, ...input, updatedAt: new Date() };
    await db.applications.put(updated);
    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    const app = await db.applications.get(id);
    if (!app || app.userId !== userId) return;
    await db.applications.delete(id);
    await db.contacts.where("applicationId").equals(id).delete();
    await db.interviews.where("applicationId").equals(id).delete();
    await db.reminders.where("applicationId").equals(id).delete();
    await db.attachments.where("applicationId").equals(id).delete();
  }

  async search(userId: string, query: string): Promise<Application[]> {
    const q = query.toLowerCase();
    const apps = await db.applications
      .where({ userId })
      .filter((a) => {
        if (a.isArchived) return false;
        return (
          a.companyName.toLowerCase().includes(q) ||
          a.positionTitle.toLowerCase().includes(q) ||
          a.notes?.toLowerCase().includes(q) ||
          a.jobDescriptionText?.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .toArray();
    return Promise.all(apps.map((a) => this.enrich(a)));
  }

  async findByStatus(userId: string, status: string): Promise<Application[]> {
    const apps = await db.applications
      .where({ userId, status: status as any })
      .filter((a) => !a.isArchived)
      .toArray();
    return Promise.all(apps.map((a) => this.enrich(a)));
  }

  async findByTags(userId: string, tags: string[]): Promise<Application[]> {
    const apps = await db.applications
      .where({ userId })
      .filter((a) => !a.isArchived && tags.every((t) => a.tags.includes(t)))
      .toArray();
    return Promise.all(apps.map((a) => this.enrich(a)));
  }

  private async enrich(app: Application): Promise<Application> {
    const [contacts, interviews, reminders, attachments] = await Promise.all([
      db.contacts.where("applicationId").equals(app.id).toArray(),
      db.interviews.where("applicationId").equals(app.id).toArray(),
      db.reminders.where("applicationId").equals(app.id).toArray(),
      db.attachments.where("applicationId").equals(app.id).toArray(),
    ]);
    return { ...app, contacts, interviews, reminders, attachments };
  }
}
