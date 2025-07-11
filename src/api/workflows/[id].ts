// import type { NextApiRequest, NextApiResponse } from 'next';
// import { WorkflowRepository } from '../../../src/infrastructure/repositories/WorkflowRepository';
// import { WorkflowUseCases } from '../../../src/application/usecases/WorkflowUseCases';
// import { withAuth } from '../_middleware/auth';

// /**
//  * @swagger
//  * /workflows/{id}:
//  *   get:
//  *     summary: Get a workflow by ID
//  *     tags: [Workflows]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *         required: true
//  *         description: Workflow ID
//  *     responses:
//  *       200:
//  *         description: Workflow found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 workflow:
//  *                   $ref: '#/components/schemas/Workflow'
//  *       404:
//  *         description: Not found
//  *   delete:
//  *     summary: Delete a workflow
//  *     tags: [Workflows]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *         required: true
//  *         description: Workflow ID
//  *     responses:
//  *       204:
//  *         description: Workflow deleted
//  */
// export default withAuth(handler);

// async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const workflowRepo = new WorkflowRepository();
//   const useCases = new WorkflowUseCases(workflowRepo);
//   const { id } = req.query;
//   if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });
//   if (req.method === 'GET') {
//     const workflow = await useCases.getById(id);
//     if (!workflow) return res.status(404).json({ error: 'Not found' });
//     return res.status(200).json({ workflow });
//   }
//   if (req.method === 'DELETE') {
//     try {
//       await useCases.delete(id);
//       res.status(204).end();
//     } catch (e: any) {
//       res.status(400).json({ error: e.message });
//     }
//     return;
//   }
//   res.status(405).json({ error: 'Method not allowed' });
// } 