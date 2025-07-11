import { PrismaClient } from '../../../generated/prisma';
import { PDFReport } from '../../core/entities/PDFReport';

const prisma = new PrismaClient();

export class PDFReportRepository {
  async create(report: Omit<PDFReport, 'ReportID' | 'GeneratedAt'>): Promise<PDFReport> {
    const created = await prisma.pDFReport.create({ data: report });
    return created as PDFReport;
  }

  async findById(reportId: string): Promise<PDFReport | null> {
    return prisma.pDFReport.findUnique({ where: { ReportID: reportId } }) as Promise<PDFReport | null>;
  }

  async findByProject(projectId: string): Promise<PDFReport[]> {
    return prisma.pDFReport.findMany({ where: { ProjectID: projectId } }) as Promise<PDFReport[]>;
  }

  async delete(reportId: string): Promise<void> {
    await prisma.pDFReport.delete({ where: { ReportID: reportId } });
  }
} 