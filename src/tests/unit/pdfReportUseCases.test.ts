import { PDFReportUseCases } from '../../application/usecases/PDFReportUseCases';

describe('PDFReportUseCases', () => {
  let reports: any[];
  let reportRepo: any;
  let useCases: PDFReportUseCases;

  beforeEach(() => {
    reports = [];
    reportRepo = {
      create: async (data: any) => {
        const report = { ...data, ReportID: 'rep-' + (reports.length + 1), GeneratedAt: new Date() };
        reports.push(report);
        return report;
      },
      findById: async (id: string) => reports.find(r => r.ReportID === id) || null,
      findByProject: async (projectId: string) => reports.filter(r => r.ProjectID === projectId),
      delete: async (id: string) => {
        const idx = reports.findIndex(r => r.ReportID === id);
        if (idx !== -1) reports.splice(idx, 1);
      },
    };
    // Stub PDFGeneratorAdapter
    const { PDFGeneratorAdapter } = require('../../infrastructure/adapters/PDFGeneratorAdapter');
    jest.spyOn(PDFGeneratorAdapter, 'generate').mockResolvedValue('/pdfs/proj-1.pdf');
    useCases = new PDFReportUseCases(reportRepo);
  });

  it('generates a PDF report', async () => {
    const report = await useCases.generate('proj-1');
    expect(report.ProjectID).toBe('proj-1');
    expect(report.FilePath).toBe('/pdfs/proj-1.pdf');
  });

  it('gets a report by id', async () => {
    const created = await useCases.generate('proj-1');
    const found = await useCases.getById(created.ReportID);
    expect(found).toBeDefined();
    expect(found?.ReportID).toBe(created.ReportID);
  });

  it('gets reports by project', async () => {
    await useCases.generate('proj-1');
    await useCases.generate('proj-2');
    const proj1Reports = await useCases.getByProject('proj-1');
    expect(proj1Reports.length).toBe(1);
    expect(proj1Reports[0].ProjectID).toBe('proj-1');
  });

  it('deletes a report', async () => {
    const created = await useCases.generate('proj-1');
    await useCases.delete(created.ReportID);
    const found = await useCases.getById(created.ReportID);
    expect(found).toBeNull();
  });
}); 