import { withCORS } from '../../../src/api/_middleware/cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { WorkflowRepository } from '../../../src/infrastructure/repositories/WorkflowRepository';
import { WorkflowUseCases } from '../../../src/application/usecases/WorkflowUseCases';

export default withCORS(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });

  if (req.method === 'DELETE') {
    const workflowRepo = new WorkflowRepository();
    const useCases = new WorkflowUseCases(workflowRepo);
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