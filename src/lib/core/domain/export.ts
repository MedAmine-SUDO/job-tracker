import { Application, Reminder } from "@/lib/core/domain/application";
import { Connection } from "@/lib/core/domain/connection";

export const EXPORT_VERSION = 1;

export type ExportFormat = "json" | "csv";

export interface ExportData {
  applications: Application[];
  connections: Connection[];
  reminders: Reminder[];
}
