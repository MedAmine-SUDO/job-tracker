import { IExportRepository } from "@/lib/core/ports/export-repository";
import { ExportData } from "@/lib/core/domain/export";
import {
  Application,
  Attachment,
  CommunicationLog,
  Contact,
  Interview,
  Reminder,
} from "@/lib/core/domain/application";
import { Connection } from "@/lib/core/domain/connection";
import { prisma } from "./prisma-client";

/**
 * Prisma Export Repository
 *
 * Pulls every record a user owns — including archived applications,
 * communications, and reminder history — so exports are lossless.
 */
export class PrismaExportRepository implements IExportRepository {
  async getExportData(userId: string): Promise<ExportData> {
    const [rawApplications, rawConnections, rawReminders] = await Promise.all([
      prisma.application.findMany({
        where: { userId },
        include: {
          contacts: true,
          interviews: { orderBy: { scheduledDate: "asc" } },
          communications: { orderBy: { createdAt: "asc" } },
          reminders: { orderBy: { dueDate: "asc" } },
          attachments: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.connection.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.reminder.findMany({
        where: { userId },
        orderBy: { dueDate: "asc" },
      }),
    ]);

    return {
      applications: rawApplications.map((a: any) => ({
        ...a,
        applicationDate: new Date(a.applicationDate),
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.updatedAt),
        contacts: a.contacts?.map((c: Contact) => ({ ...c })),
        interviews: a.interviews?.map((i: Interview) => ({
          ...i,
          scheduledDate: new Date(i.scheduledDate),
          createdAt: new Date(i.createdAt),
        })),
        communications: a.communications?.map((c: CommunicationLog) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        })),
        reminders: a.reminders?.map((r: Reminder) => ({
          ...r,
          dueDate: new Date(r.dueDate),
          createdAt: new Date(r.createdAt),
        })),
        attachments: a.attachments?.map((att: Attachment) => ({
          ...att,
          uploadedAt: new Date(att.uploadedAt),
        })),
      })) as Application[],
      connections: rawConnections.map(
        (c: any): Connection => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
        })
      ),
      reminders: rawReminders.map(
        (r: any): Reminder => ({
          ...r,
          dueDate: new Date(r.dueDate),
          createdAt: new Date(r.createdAt),
        })
      ),
    };
  }
}
