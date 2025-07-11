export class FileStorageAdapter {
  static async upload(file: Buffer, filename: string): Promise<string> {
    // TODO: Implement file upload (e.g., S3, local, etc.)
    return `/uploads/${filename}`;
  }

  static async getUrl(filename: string): Promise<string> {
    // TODO: Implement file retrieval (e.g., S3, local, etc.)
    return `/uploads/${filename}`;
  }
} 