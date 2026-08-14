import { describe, expect, it, beforeEach } from "vitest";
import { Application } from "@/lib/core/domain/application";
import { Connection } from "@/lib/core/domain/connection";
import { ExportData } from "@/lib/core/domain/export";
import { IExportRepository } from "@/lib/core/ports/export-repository";
import { ExportUseCases } from "./export-usecases";
import { serializeCsv, serializeJson } from "./export-serializers";

class FakeExportRepository implements IExportRepository {
  data: ExportData = {
    applications: [],
    connections: [],
    reminders: [],
  };
  calledWith: string | null = null;

  async getExportData(userId: string): Promise<ExportData> {
    this.calledWith = userId;
    return this.data;
  }
}

function sampleData(): ExportData {
  const app: Application = {
    id: "app-1",
    userId: "user-1",
    companyName: "Acme, Inc.",
    positionTitle: 'Senior "Engineer"',
    status: "applied",
    applicationDate: new Date("2024-01-02T00:00:00.000Z"),
    salaryCurrency: "USD",
    workType: "remote",
    tags: ["backend", "node"],
    notes: "Line one\nline two",
    isArchived: false,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-03T00:00:00.000Z"),
    contacts: [
      {
        id: "c-1",
        applicationId: "app-1",
        name: "Jane Doe",
        email: "jane@acme.com",
      },
    ],
    interviews: [],
    communications: [],
    reminders: [],
    attachments: [],
  };

  const connection: Connection = {
    id: "conn-1",
    userId: "user-1",
    name: "John Recruiter",
    linkedinUrl: "https://linkedin.com/in/john",
    purpose: "referral",
    status: "replied",
    createdAt: new Date("2024-02-01T00:00:00.000Z"),
    updatedAt: new Date("2024-02-02T00:00:00.000Z"),
  };

  return {
    applications: [app],
    connections: [connection],
    reminders: [],
  };
}

describe("ExportUseCases", () => {
  let repo: FakeExportRepository;
  let useCases: ExportUseCases;

  beforeEach(() => {
    repo = new FakeExportRepository();
    repo.data = sampleData();
    useCases = new ExportUseCases(repo);
  });

  describe("exportJson", () => {
    it("scopes the fetch to the requesting user", async () => {
      await useCases.exportJson("user-1");
      expect(repo.calledWith).toBe("user-1");
    });

    it("serializes every data set with version and exportedAt", async () => {
      const raw = await useCases.exportJson("user-1");
      const parsed = JSON.parse(raw);

      expect(parsed.version).toBeGreaterThanOrEqual(1);
      expect(typeof parsed.exportedAt).toBe("string");
      expect(parsed.applications).toHaveLength(1);
      expect(parsed.connections).toHaveLength(1);
      expect(parsed.reminders).toEqual([]);
    });

    it("keeps nested details and ISO dates", async () => {
      const raw = await useCases.exportJson("user-1");
      const parsed = JSON.parse(raw);

      expect(parsed.applications[0].contacts[0].name).toBe("Jane Doe");
      expect(parsed.applications[0].tags).toEqual(["backend", "node"]);
      expect(parsed.applications[0].applicationDate).toBe(
        "2024-01-02T00:00:00.000Z"
      );
      expect(parsed.connections[0].linkedinUrl).toContain("linkedin.com");
    });
  });

  describe("exportCsv", () => {
    it("emits a section per data set", async () => {
      const csv = await useCases.exportCsv("user-1");

      expect(csv).toContain("# Applications (1)");
      expect(csv).toContain("# Connections (1)");
      expect(csv).toContain("# Reminders (0)");
    });

    it("quotes fields containing commas, quotes, or newlines", async () => {
      const csv = await useCases.exportCsv("user-1");
      const appLine = csv.split("\n").find((l) => l.startsWith("app-1,"));
      expect(appLine).toBeDefined();
      expect(appLine).toContain('"Acme, Inc."');
      expect(appLine).toContain('"Senior ""Engineer"""');
      expect(csv).toContain('"Line one\nline two"');
    });

    it("serializes nested relations as JSON inside cells", async () => {
      const csv = await useCases.exportCsv("user-1");
      expect(csv).toContain('"Jane Doe"');
    });
  });
});

describe("serializeJson", () => {
  it("produces a parseable envelope", () => {
    const out = JSON.parse(serializeJson(sampleData()));
    expect(out.applications).toHaveLength(1);
    expect(out.connections).toHaveLength(1);
  });
});

describe("serializeCsv", () => {
  it("returns an empty body when there is no data", () => {
    const csv = serializeCsv({
      applications: [],
      connections: [],
      reminders: [],
    });
    expect(csv).toContain("# Applications (0)");
  });
});
