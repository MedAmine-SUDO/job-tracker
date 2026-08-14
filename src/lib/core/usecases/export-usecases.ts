import { ExportData } from "@/lib/core/domain/export";
import { IExportRepository } from "@/lib/core/ports/export-repository";
import { serializeCsv, serializeJson } from "./export-serializers";

export class ExportUseCases {
  constructor(private repo: IExportRepository) {}

  async getExportData(userId: string): Promise<ExportData> {
    return this.repo.getExportData(userId);
  }

  async exportJson(userId: string): Promise<string> {
    const data = await this.repo.getExportData(userId);
    return serializeJson(data);
  }

  async exportCsv(userId: string): Promise<string> {
    const data = await this.repo.getExportData(userId);
    return serializeCsv(data);
  }
}
