import { PDFReportRepository } from '../../infrastructure/repositories/PDFReportRepository';
import { PDFGeneratorAdapter } from '../../infrastructure/adapters/PDFGeneratorAdapter';
import { PDFReport } from '../../core/entities/PDFReport';

export class PDFReportUseCases {
  private reportRepo: PDFReportRepository;

  constructor(reportRepo: PDFReportRepository) {
    this.reportRepo = reportRepo;
  }

  async generate(projectId: string): Promise<PDFReport> {
    // Stub: generate PDF and save report
    const filePath = await PDFGeneratorAdapter.generate(projectId);
    return this.reportRepo.create({
      ProjectID: projectId,
      FilePath: filePath,
    });
  }

  async getById(reportId: string): Promise<PDFReport | null> {
    return this.reportRepo.findById(reportId);
  }

  async getByProject(projectId: string): Promise<PDFReport[]> {
    return this.reportRepo.findByProject(projectId);
  }

  async delete(reportId: string) {
    return this.reportRepo.delete(reportId);
  }
} 