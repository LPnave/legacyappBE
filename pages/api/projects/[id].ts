import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { ProjectRepository } from '../../../src/infrastructure/repositories/ProjectRepository';
import { ProjectUseCases } from '../../../src/application/usecases/ProjectUseCases';
import { ProjectStatus } from '../../../src/core/enums/ProjectStatus';
import { withAuth } from '../_middleware/auth';
import { withCORS } from '../../../src/api/_middleware/cors';

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               status:
 *                 $ref: '#/components/schemas/ProjectStatus'
 *               description:
 *                 type: string
 *               createdBy:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Project updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Project ID
 *     responses:
 *       204:
 *         description: Project deleted
 */
const updateSchema = z.object({
  title: z.string().min(1).optional(),
  status: z.enum(['Working', 'Review', 'Ready']).optional(),
  description: z.string().optional(),
  createdBy: z.string().uuid().optional(),
});

export default withCORS(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const projectRepo = new ProjectRepository();
  const useCases = new ProjectUseCases(projectRepo);
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });
  if (req.method === 'GET') {
    const project = await useCases.getById(id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ project });
  }
  if (req.method === 'PUT') {
    const parse = updateSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.issues });
    const updateData: any = { ...parse.data };
    if (updateData.createdBy) {
      updateData.CreatedBy = updateData.createdBy;
      delete updateData.createdBy;
    }
    try {
      const updated = await useCases.update(id, updateData);
      res.status(200).json({ project: updated });
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
}); 