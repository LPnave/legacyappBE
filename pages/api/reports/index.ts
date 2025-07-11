import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { PDFReportRepository } from '../../../src/infrastructure/repositories/PDFReportRepository';
import { PDFReportUseCases } from '../../../src/application/usecases/PDFReportUseCases';
import { withAuth } from '../_middleware/auth';

const schema = z.object({
  projectId: z.string().uuid(),
});

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get reports by projectId
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: List of reports
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reports:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PDFReport'
 *   post:
 *     summary: Generate a new PDF report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *                 format: uuid
 *             required:
 *               - projectId
 *     responses:
 *       201:
 *         description: Report generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report:
 *                   $ref: '#/components/schemas/PDFReport'
 */
export default withAuth(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const reportRepo = new PDFReportRepository();
  const useCases = new PDFReportUseCases(reportRepo);
  if (req.method === 'GET') {
    const { projectId } = req.query;
    if (typeof projectId !== 'string') return res.status(400).json({ error: 'Missing projectId' });
    const reports = await useCases.getByProject(projectId);
    return res.status(200).json({ reports });
  }
  if (req.method === 'POST') {
    const parse = schema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.issues });
    const { projectId } = parse.data;
    try {
      const report = await useCases.generate(projectId);
      res.status(201).json({ report });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
    return;
  }
  res.status(405).json({ error: 'Method not allowed' });
} 