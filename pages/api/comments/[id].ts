import type { NextApiRequest, NextApiResponse } from 'next';
import { CommentRepository } from '../../../src/infrastructure/repositories/CommentRepository';
import { CommentUseCases } from '../../../src/application/usecases/CommentUseCases';
import { withAuth } from '../_middleware/auth';
import { withCORS } from '../../../src/api/_middleware/cors';

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Comment ID
 *     responses:
 *       204:
 *         description: Comment deleted
 */
export default withCORS(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const commentRepo = new CommentRepository();
  const useCases = new CommentUseCases(commentRepo);
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });
  if (req.method === 'GET') {
    const comment = await useCases.getById(id);
    if (!comment) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ comment });
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
}); 