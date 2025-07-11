export class PDFGeneratorAdapter {
  static async generate(projectId: string): Promise<string> {
    // TODO: Implement PDF generation logic
    return `/pdfs/${projectId}.pdf`;
  }
} 