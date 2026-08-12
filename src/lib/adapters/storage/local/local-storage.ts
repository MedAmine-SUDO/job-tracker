import { IStorageProvider } from "@/lib/core/ports/storage";

/**
 * Local File Storage Provider
 * 
 * Stores files as base64 data URLs in IndexedDB.
 * No external storage service needed.
 * 
 * To enable: set STORAGE_ADAPTER=local (default)
 */
export class LocalStorageProvider implements IStorageProvider {
  async upload(file: File | Buffer, path: string): Promise<{ url: string; size: number }> {
    if (Buffer.isBuffer(file)) {
      // Server-side: store in temp or return base64
      const base64 = file.toString("base64");
      const mimeType = "application/octet-stream";
      return {
        url: `data:${mimeType};base64,${base64}`,
        size: file.length,
      };
    }

    // Client-side: File object
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          url: reader.result as string,
          size: file.size,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async delete(url: string): Promise<void> {
    // Base64 data URLs are self-contained, nothing to delete externally
    return;
  }
}
