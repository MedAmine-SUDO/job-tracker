import { ExportData } from "@/lib/core/domain/export";

export interface IExportRepository {
  getExportData(userId: string): Promise<ExportData>;
}
