import type { NextApiRequest, NextApiResponse } from 'next';
import { ProjectAssignmentRepository } from '../../../src/infrastructure/repositories/ProjectAssignmentRepository';
import { ProjectAssignmentUseCases } from '../../../src/application/usecases/ProjectAssignmentUseCases';
import { withAuth } from '../_middleware/auth';
import { withCORS } from '../../../src/api/_middleware/cors';

/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     summary: Get an assignment by ID
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Assignment found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assignment:
 *                   $ref: '#/components/schemas/ProjectAssignment'
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete an assignment
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Assignment ID
 *     responses:
 *       204:
 *         description: Assignment deleted
 */
export default withCORS(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const assignmentRepo = new ProjectAssignmentRepository();
  const useCases = new ProjectAssignmentUseCases(assignmentRepo);
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });
  if (req.method === 'GET') {
    const assignment = await useCases.getById(id);
    if (!assignment) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ assignment });
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