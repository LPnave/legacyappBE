import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { PageRepository } from '../../../src/infrastructure/repositories/PageRepository';
import { PageUseCases } from '../../../src/application/usecases/PageUseCases';
import { withAuth } from '../_middleware/auth';
import { withCORS } from '../../../src/api/_middleware/cors';

const schema = z.object({
  projectId: z.string().uuid(),
  title: z.string().optional(),
  screenshotPath: z.string(),
  order: z.number().int(),
});

/**
 * @swagger
 * /pages:
 *   get:
 *     summary: Get pages by projectId
 *     tags: [Pages]
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
 *         description: List of pages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Page'
 *   post:
 *     summary: Create a new page
 *     tags: [Pages]
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
 *               title:
 *                 type: string
 *               screenshotPath:
 *                 type: string
 *               order:
 *                 type: integer
 *             required:
 *               - projectId
 *               - screenshotPath
 *               - order
 *     responses:
 *       201:
 *         description: Page created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   $ref: '#/components/schemas/Page'
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pageRepo = new PageRepository();
  const useCases = new PageUseCases(pageRepo);
  if (req.method === 'GET') {
    const { projectId } = req.query;
    if (typeof projectId !== 'string') return res.status(400).json({ error: 'Missing projectId' });
    const pages = await useCases.getByProject(projectId);
    return res.status(200).json({ pages });
  }
  if (req.method === 'POST') {
    const parse = schema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.issues });
    const { projectId, title, screenshotPath, order } = parse.data;
    try {
      const page = await useCases.create({
        ProjectID: projectId,
        Title: title,
        ScreenshotPath: screenshotPath,
        Order: order,
      });
      res.status(201).json({ page });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
    return;
  }
  res.status(405).json({ error: 'Method not allowed' });
}

export default withCORS(withAuth(handler)); 