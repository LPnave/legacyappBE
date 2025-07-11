import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { WorkflowRepository } from '../../../src/infrastructure/repositories/WorkflowRepository';
import { WorkflowUseCases } from '../../../src/application/usecases/WorkflowUseCases';
import { withAuth } from '../_middleware/auth';

const schema = z.object({
  fromPageId: z.string().uuid(),
  toPageId: z.string().uuid(),
  label: z.string().optional(),
});

/**
 * @swagger
 * /workflows:
 *   get:
 *     summary: Get workflows by fromPageId or toPageId
 *     tags: [Workflows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromPageId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: false
 *         description: From Page ID
 *       - in: query
 *         name: toPageId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: false
 *         description: To Page ID
 *     responses:
 *       200:
 *         description: List of workflows
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workflows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Workflow'
 *   post:
 *     summary: Create a new workflow
 *     tags: [Workflows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromPageId:
 *                 type: string
 *                 format: uuid
 *               toPageId:
 *                 type: string
 *                 format: uuid
 *               label:
 *                 type: string
 *             required:
 *               - fromPageId
 *               - toPageId
 *     responses:
 *       201:
 *         description: Workflow created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workflow:
 *                   $ref: '#/components/schemas/Workflow'
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const workflowRepo = new WorkflowRepository();
  const useCases = new WorkflowUseCases(workflowRepo);
  if (req.method === 'GET') {
    const { fromPageId, toPageId } = req.query;
    if (typeof fromPageId === 'string') {
      const workflows = await useCases.getByFromPage(fromPageId);
      return res.status(200).json({ workflows });
    }
    if (typeof toPageId === 'string') {
      const workflows = await useCases.getByToPage(toPageId);
      return res.status(200).json({ workflows });
    }
    return res.status(400).json({ error: 'Missing fromPageId or toPageId' });
  }
  if (req.method === 'POST') {
    const parse = schema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.issues });
    const { fromPageId, toPageId, label } = parse.data;
    try {
      const workflow = await useCases.create({
        FromPageID: fromPageId,
        ToPageID: toPageId,
        Label: label,
        CreatedAt: new Date(),
      });
      res.status(201).json({ workflow });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
    return;
  }
  res.status(405).json({ error: 'Method not allowed' });
}

export default withAuth(handler); 