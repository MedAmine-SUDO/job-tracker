import { NextResponse } from "next/server";
import { container } from "@/lib/infrastructure/container";
import { ExportUseCases } from "@/lib/core/usecases/export-usecases";
import { ExportFormat } from "@/lib/core/domain/export";

/**
 * GET /api/export?format=json|csv
 *
 * Downloads the authenticated user's full data set — applications
 * (including archived ones) with contacts, interviews, communications,
 * reminders, and attachments, plus connections and standalone reminders.
 */
export async function GET(req: Request) {
  try {
    const auth = await container.getAuth();
    const userId = await auth.requireAuth();

    const format: ExportFormat =
      new URL(req.url).searchParams.get("format") === "csv" ? "csv" : "json";

    const exportRepo = await container.getExportRepository();
    const useCases = new ExportUseCases(exportRepo);

    const filename = `job-tracker-export.${format}`;
    if (format === "csv") {
      const csv = await useCases.exportCsv(userId);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    const json = await useCases.exportJson(userId);
    return new NextResponse(json, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
