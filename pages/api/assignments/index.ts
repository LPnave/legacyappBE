import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { ProjectAssignmentRepository } from '../../../src/infrastructure/repositories/ProjectAssignmentRepository';
import { ProjectAssignmentUseCases } from '../../../src/application/usecases/ProjectAssignmentUseCases';
import { withAuth } from '../_middleware/auth';
import { withCORS } from '../../../src/api/_middleware/cors';

const schema = z.object({
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
});

/**
 * @swagger
 * /assignments:
 *   get:
 *     summary: Get assignments by projectId or userId
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: false
 *         description: Project ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: false
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assignments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProjectAssignment'
 *   post:
 *     summary: Create a new assignment
 *     tags: [Assignments]
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
 *               userId:
 *                 type: string
 *                 format: uuid
 *             required:
 *               - projectId
 *               - userId
 *     responses:
 *       201:
 *         description: Assignment created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assignment:
 *                   $ref: '#/components/schemas/ProjectAssignment'
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const assignmentRepo = new ProjectAssignmentRepository();
  const useCases = new ProjectAssignmentUseCases(assignmentRepo);
  if (req.method === 'GET') {
    const { projectId, userId } = req.query;
    if (typeof projectId === 'string') {
      const assignments = await useCases.getByProject(projectId);
      return res.status(200).json({ assignments });
    }
    if (typeof userId === 'string') {
      const assignments = await useCases.getByUser(userId);
      return res.status(200).json({ assignments });
    }
    return res.status(400).json({ error: 'Missing projectId or userId' });
  }
  if (req.method === 'POST') {
    const parse = schema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.issues });
    const { projectId, userId } = parse.data;
    try {
      const assignment = await useCases.create({
        ProjectID: projectId,
        UserID: userId,
        AssignedAt: new Date(),
      });
      res.status(201).json({ assignment });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
    return;
  }
  res.status(405).json({ error: 'Method not allowed' });
}

export default withCORS(withAuth(handler)); 