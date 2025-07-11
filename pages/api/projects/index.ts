import type { NextApiRequest, NextApiResponse } from 'next';
import { ProjectRepository } from '../../../src/infrastructure/repositories/ProjectRepository';
import { ProjectUseCases } from '../../../src/application/usecases/ProjectUseCases';
import { ProjectStatus } from '../../../src/core/enums/ProjectStatus';
import { withAuth } from '../_middleware/auth';
import { withCORS } from '../../../src/api/_middleware/cors';
import { ProjectCreateSchema, ProjectCreateDTO } from '../../../src/dto/ProjectCreateDTO';

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               createdBy:
 *                 type: string
 *                 format: uuid
 *               status:
 *                 $ref: '#/components/schemas/ProjectStatus'
 *               description:
 *                 type: string
 *             required:
 *               - title
 *               - createdBy
 *               - status
 *     responses:
 *       201:
 *         description: Project created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 */

export default withCORS(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const projectRepo = new ProjectRepository();
  const useCases = new ProjectUseCases(projectRepo);
  if (req.method === 'GET') {
    const projects = await useCases.getAll();
    return res.status(200).json({ projects });
  }
  if (req.method === 'POST') {
    // Map frontend fields to DTO fields
    const body: Partial<ProjectCreateDTO> = {
      title: req.body.Title || req.body.title,
      createdBy: req.body.CreatedBy || req.body.createdBy,
      status: req.body.Status || req.body.status || ProjectStatus.Working,
      description: req.body.Description || req.body.description,
    };
    const parse = ProjectCreateSchema.safeParse(body);
    if (!parse.success) return res.status(400).json({ error: parse.error.issues });
    const { title, createdBy, status, description } = parse.data;
    try {
      const project = await useCases.create(title, createdBy, status, description);
      res.status(201).json({ project });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
    return;
  }
  res.status(405).json({ error: 'Method not allowed' });
}); 