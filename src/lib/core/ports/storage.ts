export interface StoredFile {
  url: string;
  size: number;
}

export interface IStorageProvider {
  upload(file: File | Buffer, path: string): Promise<StoredFile>;
  delete(url: string): Promise<void>;
}
