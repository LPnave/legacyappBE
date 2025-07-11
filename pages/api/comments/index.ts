import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { CommentRepository } from '../../../src/infrastructure/repositories/CommentRepository';
import { CommentUseCases } from '../../../src/application/usecases/CommentUseCases';
import { withAuth } from '../_middleware/auth';
import { withCORS } from '../../../src/api/_middleware/cors';

const schema = z.object({
  pageId: z.string().uuid(),
  content: z.string().min(1),
});

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get comments by pageId
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pageId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Page ID
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageId:
 *                 type: string
 *                 format: uuid
 *               userId:
 *                 type: string
 *                 format: uuid
 *               content:
 *                 type: string
 *             required:
 *               - pageId
 *               - userId
 *               - content
 *     responses:
 *       201:
 *         description: Comment created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const commentRepo = new CommentRepository();
  const useCases = new CommentUseCases(commentRepo);
  if (req.method === 'GET') {
    const { pageId } = req.query;
    if (typeof pageId !== 'string') return res.status(400).json({ error: 'Missing pageId' });
    const comments = await useCases.getByPage(pageId);
    return res.status(200).json({ comments });
  }
  if (req.method === 'POST') {
    const parse = schema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.issues });
    const { pageId, content } = parse.data;
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const comment = await useCases.create({
        PageID: pageId,
        UserID: userId,
        Content: content,
        CreatedAt: new Date(),
      });
      res.status(201).json({ comment });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
    return;
  }
  res.status(405).json({ error: 'Method not allowed' });
}

export default withCORS(withAuth(handler)); 