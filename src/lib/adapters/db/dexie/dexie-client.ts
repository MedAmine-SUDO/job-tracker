import Dexie, { Table } from "dexie";
import { Application, Contact, Interview, Reminder, Attachment } from "@/lib/core/domain/application";
import { Connection } from "@/lib/core/domain/connection";

/**
 * Dexie Database Client
 * 
 * Pure client-side IndexedDB storage. No server needed.
 * Perfect for: offline-first, zero-backend, privacy-focused users.
 * 
 * Limitations: No cross-device sync (unless you build it).
 */
class JobTrackerDB extends Dexie {
  applications!: Table<Application, string>;
  contacts!: Table<Contact, string>;
  interviews!: Table<Interview, string>;
  reminders!: Table<Reminder, string>;
  attachments!: Table<Attachment, number>;
  connections!: Table<Connection, string>;

  constructor() {
    super("JobTrackerDB");
    this.version(1).stores({
      applications: "++id, userId, companyName, status, isArchived, tags, createdAt",
      contacts: "++id, applicationId, name, email",
      interviews: "++id, applicationId, scheduledDate, completed",
      reminders: "++id, userId, applicationId, dueDate, isCompleted",
      attachments: "++id, applicationId, category, uploadedAt",
    });
    this.version(2).stores({
      connections: "++id, userId, name, status, purpose, createdAt",
    });
  }
}

export const db = new JobTrackerDB();
