import { IExportRepository } from "@/lib/core/ports/export-repository";
import { ExportData } from "@/lib/core/domain/export";
import { Application, CommunicationLog } from "@/lib/core/domain/application";
import { Connection } from "@/lib/core/domain/connection";
import { db } from "./dexie-client";

/**
 * Dexie Export Repository
 *
 * Reads everything from IndexedDB, including archived applications.
 * IndexedDB has no communications table, so that relation is empty.
 */
export class DexieExportRepository implements IExportRepository {
  async getExportData(userId: string): Promise<ExportData> {
    const [applications, connections, reminders] = await Promise.all([
      db.applications.where({ userId }).toArray(),
      db.connections.where({ userId }).toArray(),
      db.reminders.where({ userId }).toArray(),
    ]);

    const enriched = await Promise.all(
      applications.map((a) => this.enrich(a))
    );

    return {
      applications: enriched,
      connections: connections.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      ),
      reminders: reminders.sort(
        (a, b) => b.dueDate.getTime() - a.dueDate.getTime()
      ),
    };
  }

  private async enrich(app: Application): Promise<Application> {
    const [contacts, interviews, appReminders, attachments] =
      await Promise.all([
        db.contacts.where("applicationId").equals(app.id).toArray(),
        db.interviews.where("applicationId").equals(app.id).toArray(),
        db.reminders.where("applicationId").equals(app.id).toArray(),
        db.attachments.where("applicationId").equals(app.id).toArray(),
      ]);
    return {
      ...app,
      contacts,
      interviews,
      communications: [] as CommunicationLog[],
      reminders: appReminders,
      attachments,
    };
  }
}
