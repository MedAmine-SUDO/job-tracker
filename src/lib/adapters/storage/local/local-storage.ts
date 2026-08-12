import { IStorageProvider } from "@/lib/core/ports/storage";

/**
 * Local File Storage Provider
 *
 * Stores files as base64 data URLs in the database.
 * No external storage service needed.
 *
 * To enable: set STORAGE_ADAPTER=local (default)
 */
const EXTENSION_MIMES: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  txt: "text/plain",
  md: "text/markdown",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  csv: "text/csv",
};

function detectMime(path: string, fileType?: string): string {
  if (fileType && fileType !== "application/octet-stream") return fileType;
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_MIMES[ext] ?? "application/octet-stream";
}

export class LocalStorageProvider implements IStorageProvider {
  async upload(file: File | Buffer, path: string): Promise<{ url: string; size: number }> {
    const buffer = Buffer.isBuffer(file)
      ? file
      : Buffer.from(await file.arrayBuffer());
    const mimeType = detectMime(path, "type" in file ? (file as File).type : undefined);
    const base64 = buffer.toString("base64");
    return {
      url: `data:${mimeType};base64,${base64}`,
      size: buffer.length,
    };
  }

  async delete(url: string): Promise<void> {
    // Base64 data URLs are self-contained, nothing to delete externally
    return;
  }
}
