import { withCORS } from '../../../src/api/_middleware/cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { WorkflowRepository } from '../../../src/infrastructure/repositories/WorkflowRepository';
import { WorkflowUseCases } from '../../../src/application/usecases/WorkflowUseCases';
import { z } from 'zod';

const createSchema = z.object({
  fromPageId: z.string(),
  toPageId: z.string(),
  label: z.string().optional(),
});

export default withCORS(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const workflowRepo = new WorkflowRepository();
  const useCases = new WorkflowUseCases(workflowRepo);

  if (req.method === 'POST') {
    const parse = createSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.issues });
    const { fromPageId, toPageId, label } = parse.data;
    try {
      const created = await useCases.create({
        FromPageID: fromPageId,
        ToPageID: toPageId,
        Label: label,
        CreatedAt: new Date(),
      });
      res.status(201).json({ workflow: created });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
    return;
  }

  if (req.method === 'GET') {
    const { projectId } = req.query;
    if (!projectId || typeof projectId !== 'string') {
      return res.status(400).json({ error: 'Missing projectId' });
    }
    try {
      // Find all pages for the project, then all workflows for those pages
      const prisma = new (require('../../../generated/prisma').PrismaClient)();
      const pages = await prisma.page.findMany({ where: { ProjectID: projectId } });
      const pageIds = pages.map((p: any) => p.PageID);
      const workflows = await prisma.workflow.findMany({
        where: {
          OR: [
            { FromPageID: { in: pageIds } },
            { ToPageID: { in: pageIds } },
          ],
        },
      });
      res.status(200).json({ workflows });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}); 