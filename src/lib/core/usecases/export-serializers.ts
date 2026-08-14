import { ExportData, EXPORT_VERSION } from "@/lib/core/domain/export";
import { Application, Reminder } from "@/lib/core/domain/application";
import { Connection } from "@/lib/core/domain/connection";

export function serializeJson(data: ExportData): string {
  return JSON.stringify(
    {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      applications: data.applications,
      connections: data.connections,
      reminders: data.reminders,
    },
    null,
    2
  );
}

const APPLICATION_COLUMNS: (keyof Application)[] = [
  "id",
  "userId",
  "companyName",
  "positionTitle",
  "status",
  "applicationDate",
  "jobPostingUrl",
  "jobDescriptionText",
  "salaryRangeMin",
  "salaryRangeMax",
  "salaryCurrency",
  "location",
  "workType",
  "source",
  "tags",
  "notes",
  "isArchived",
  "createdAt",
  "updatedAt",
  "contacts",
  "interviews",
  "communications",
  "reminders",
  "attachments",
];

const CONNECTION_COLUMNS: (keyof Connection)[] = [
  "id",
  "userId",
  "name",
  "linkedinUrl",
  "purpose",
  "customPurpose",
  "status",
  "notes",
  "createdAt",
  "updatedAt",
];

const REMINDER_COLUMNS: (keyof Reminder)[] = [
  "id",
  "userId",
  "applicationId",
  "title",
  "dueDate",
  "isCompleted",
  "notificationSent",
  "createdAt",
];

export function serializeCsv(data: ExportData): string {
  const sections = [
    csvSection(
      `Applications (${data.applications.length})`,
      APPLICATION_COLUMNS,
      data.applications
    ),
    csvSection(
      `Connections (${data.connections.length})`,
      CONNECTION_COLUMNS,
      data.connections
    ),
    csvSection(
      `Reminders (${data.reminders.length})`,
      REMINDER_COLUMNS,
      data.reminders
    ),
  ];

  return sections.filter((s) => s.length > 0).join("\n\n");
}

function csvSection<T>(title: string, columns: string[], rows: T[]): string {
  const header = ["# " + title, ""].join("\n");
  const body = toCsv(rows, columns);
  return body ? `${header}\n${body}` : `${header}\n`;
}

function toCsv<T>(rows: T[], columns: string[]): string {
  if (rows.length === 0) return "";
  const lines = [columns.map(csvEscape).join(",")];
  for (const row of rows) {
    const record = row as Record<string, unknown>;
    lines.push(columns.map((col) => csvEscape(cellToString(record[col]))).join(","));
  }
  return lines.join("\n");
}

function cellToString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
