import type { NextApiRequest, NextApiResponse } from 'next';
import { PDFReportRepository } from '../../../src/infrastructure/repositories/PDFReportRepository';
import { PDFReportUseCases } from '../../../src/application/usecases/PDFReportUseCases';
import { withAuth } from '../_middleware/auth';
import { withCORS } from '../../../src/api/_middleware/cors';

/**
 * @swagger
 * /reports/{id}:
 *   get:
 *     summary: Get a report by ID
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report:
 *                   $ref: '#/components/schemas/PDFReport'
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Report ID
 *     responses:
 *       204:
 *         description: Report deleted
 */
export default withCORS(withAuth(handler));

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const reportRepo = new PDFReportRepository();
  const useCases = new PDFReportUseCases(reportRepo);
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });
  if (req.method === 'GET') {
    const report = await useCases.getById(id);
    if (!report) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ report });
  }
  if (req.method === 'DELETE') {
    try {
      await useCases.delete(id);
      res.status(204).end();
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
    return;
  }
  res.status(405).json({ error: 'Method not allowed' });
} 