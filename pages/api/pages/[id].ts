import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { PageRepository } from '../../../src/infrastructure/repositories/PageRepository';
import { PageUseCases } from '../../../src/application/usecases/PageUseCases';
import { withAuth } from '../_middleware/auth';
import { withCORS } from '../../../src/api/_middleware/cors';

const updateSchema = z.object({
  title: z.string().optional(),
  screenshotPath: z.string().optional(),
  order: z.number().int().optional(),
  PositionX: z.number().optional(),
  PositionY: z.number().optional(),
});

/**
 * @swagger
 * /pages/{id}:
 *   get:
 *     summary: Get a page by ID
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Page ID
 *     responses:
 *       200:
 *         description: Page found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   $ref: '#/components/schemas/Page'
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a page
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Page ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               screenshotPath:
 *                 type: string
 *               order:
 *                 type: integer
 *               PositionX:
 *                 type: number
 *               PositionY:
 *                 type: number
 *     responses:
 *       200:
 *         description: Page updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   $ref: '#/components/schemas/Page'
 *   delete:
 *     summary: Delete a page
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Page ID
 *     responses:
 *       204:
 *         description: Page deleted
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pageRepo = new PageRepository();
  const useCases = new PageUseCases(pageRepo);
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });
  if (req.method === 'GET') {
    const page = await useCases.getById(id);
    if (!page) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ page });
  }
  if (req.method === 'PUT') {
    const parse = updateSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.issues });
    const updateData: any = { ...parse.data };
    // Map camelCase to Prisma field names
    if (updateData.title !== undefined) {
      updateData.Title = updateData.title;
      delete updateData.title;
    }
    if (updateData.screenshotPath !== undefined) {
      updateData.ScreenshotPath = updateData.screenshotPath;
      delete updateData.screenshotPath;
    }
    if (updateData.order !== undefined) {
      updateData.Order = updateData.order;
      delete updateData.order;
    }
    if (updateData.PositionX !== undefined) {
      updateData.PositionX = updateData.PositionX;
    }
    if (updateData.PositionY !== undefined) {
      updateData.PositionY = updateData.PositionY;
    }
    try {
      const updated = await useCases.update(id, updateData);
      res.status(200).json({ page: updated });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
    return;
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

export default withCORS(withAuth(handler)); 