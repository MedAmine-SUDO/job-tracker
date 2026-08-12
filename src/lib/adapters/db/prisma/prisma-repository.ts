import { IApplicationRepository } from "@/lib/core/ports/repository";
import { Application, CreateApplicationInput, UpdateApplicationInput } from "@/lib/core/domain/application";
import { prisma } from "./prisma-client";

/**
 * Prisma Application Repository
 * 
 * Works with ANY PostgreSQL provider:
 * - Neon (recommended, no pause)
 * - Supabase Postgres
 * - Railway Postgres
 * - AWS RDS
 * - Self-hosted Postgres
 * - SQLite (with Prisma SQLite provider)
 * 
 * Just change DATABASE_URL in .env.local. Zero code changes.
 */
export class PrismaApplicationRepository implements IApplicationRepository {
  async findAll(userId: string): Promise<Application[]> {
    const apps = await prisma.application.findMany({
      where: { userId, isArchived: false },
      include: {
        contacts: true,
        interviews: { orderBy: { scheduledDate: "asc" } },
        reminders: { orderBy: { dueDate: "asc" } },
        attachments: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return apps.map(this.mapToDomain);
  }

  async findById(id: string, userId: string): Promise<Application | null> {
    const app = await prisma.application.findFirst({
      where: { id, userId },
      include: {
        contacts: true,
        interviews: { orderBy: { scheduledDate: "asc" } },
        reminders: { orderBy: { dueDate: "asc" } },
        attachments: true,
      },
    });
    return app ? this.mapToDomain(app) : null;
  }

  async create(userId: string, input: CreateApplicationInput): Promise<Application> {
    const app = await prisma.application.create({
      data: {
        userId,
        companyName: input.companyName,
        positionTitle: input.positionTitle,
        status: input.status || "applied",
        applicationDate: input.applicationDate || new Date(),
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
      },
      include: { contacts: true, interviews: true, reminders: true, attachments: true },
    });
    return this.mapToDomain(app);
  }

  async update(id: string, userId: string, input: UpdateApplicationInput): Promise<Application> {
    const app = await prisma.application.update({
      where: { id, userId },
      data: {
        ...(input.companyName !== undefined && { companyName: input.companyName }),
        ...(input.positionTitle !== undefined && { positionTitle: input.positionTitle }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.jobPostingUrl !== undefined && { jobPostingUrl: input.jobPostingUrl }),
        ...(input.jobDescriptionText !== undefined && { jobDescriptionText: input.jobDescriptionText }),
        ...(input.salaryRangeMin !== undefined && { salaryRangeMin: input.salaryRangeMin }),
        ...(input.salaryRangeMax !== undefined && { salaryRangeMax: input.salaryRangeMax }),
        ...(input.salaryCurrency !== undefined && { salaryCurrency: input.salaryCurrency }),
        ...(input.location !== undefined && { location: input.location }),
        ...(input.workType !== undefined && { workType: input.workType }),
        ...(input.source !== undefined && { source: input.source }),
        ...(input.tags !== undefined && { tags: input.tags }),
        ...(input.notes !== undefined && { notes: input.notes }),
        ...(input.isArchived !== undefined && { isArchived: input.isArchived }),
      },
      include: { contacts: true, interviews: true, reminders: true, attachments: true },
    });
    return this.mapToDomain(app);
  }

  async delete(id: string, userId: string): Promise<void> {
    await prisma.application.delete({ where: { id, userId } });
  }

  async search(userId: string, query: string): Promise<Application[]> {
    const apps = await prisma.application.findMany({
      where: {
        userId,
        isArchived: false,
        OR: [
          { companyName: { contains: query, mode: "insensitive" } },
          { positionTitle: { contains: query, mode: "insensitive" } },
          { notes: { contains: query, mode: "insensitive" } },
          { jobDescriptionText: { contains: query, mode: "insensitive" } },
          { tags: { has: query } },
        ],
      },
      include: { contacts: true, interviews: true, reminders: true, attachments: true },
      orderBy: { createdAt: "desc" },
    });
    return apps.map(this.mapToDomain);
  }

  async findByStatus(userId: string, status: string): Promise<Application[]> {
    const apps = await prisma.application.findMany({
      where: { userId, status: status as any, isArchived: false },
      include: { contacts: true, interviews: true, reminders: true, attachments: true },
      orderBy: { createdAt: "desc" },
    });
    return apps.map(this.mapToDomain);
  }

  async findByTags(userId: string, tags: string[]): Promise<Application[]> {
    const apps = await prisma.application.findMany({
      where: { userId, tags: { hasEvery: tags }, isArchived: false },
      include: { contacts: true, interviews: true, reminders: true, attachments: true },
      orderBy: { createdAt: "desc" },
    });
    return apps.map(this.mapToDomain);
  }

  private mapToDomain(raw: any): Application {
    return {
      ...raw,
      applicationDate: new Date(raw.applicationDate),
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
      contacts: raw.contacts?.map((c: any) => ({ ...c })),
      interviews: raw.interviews?.map((i: any) => ({
        ...i,
        scheduledDate: new Date(i.scheduledDate),
        createdAt: new Date(i.createdAt),
      })),
      reminders: raw.reminders?.map((r: any) => ({
        ...r,
        dueDate: new Date(r.dueDate),
        createdAt: new Date(r.createdAt),
      })),
      attachments: raw.attachments?.map((a: any) => ({
        ...a,
        uploadedAt: new Date(a.uploadedAt),
      })),
    };
  }
}
