import { WorkflowUseCases } from '../../application/usecases/WorkflowUseCases';

describe('WorkflowUseCases', () => {
  let workflows: any[];
  let workflowRepo: any;
  let useCases: WorkflowUseCases;

  beforeEach(() => {
    workflows = [];
    workflowRepo = {
      create: async (data: any) => {
        const workflow = { ...data, WorkflowID: 'wf-' + (workflows.length + 1) };
        workflows.push(workflow);
        return workflow;
      },
      findById: async (id: string) => workflows.find(w => w.WorkflowID === id) || null,
      findByFromPage: async (pageId: string) => workflows.filter(w => w.FromPageID === pageId),
      findByToPage: async (pageId: string) => workflows.filter(w => w.ToPageID === pageId),
      delete: async (id: string) => {
        const idx = workflows.findIndex(w => w.WorkflowID === id);
        if (idx !== -1) workflows.splice(idx, 1);
      },
    };
    useCases = new WorkflowUseCases(workflowRepo);
  });

  it('creates a workflow', async () => {
    const wf = await useCases.create({ FromPageID: 'pg1', ToPageID: 'pg2', Label: 'Go', CreatedAt: new Date() });
    expect(wf.FromPageID).toBe('pg1');
    expect(wf.ToPageID).toBe('pg2');
    expect(wf.Label).toBe('Go');
  });

  it('gets a workflow by id', async () => {
    const created = await useCases.create({ FromPageID: 'pg1', ToPageID: 'pg2', Label: 'Go', CreatedAt: new Date() });
    const found = await useCases.getById(created.WorkflowID);
    expect(found).toBeDefined();
    expect(found?.WorkflowID).toBe(created.WorkflowID);
  });

  it('gets workflows by fromPage', async () => {
    await useCases.create({ FromPageID: 'pg1', ToPageID: 'pg2', Label: 'A', CreatedAt: new Date() });
    await useCases.create({ FromPageID: 'pg2', ToPageID: 'pg3', Label: 'B', CreatedAt: new Date() });
    const fromPg1 = await useCases.getByFromPage('pg1');
    expect(fromPg1.length).toBe(1);
    expect(fromPg1[0].Label).toBe('A');
  });

  it('gets workflows by toPage', async () => {
    await useCases.create({ FromPageID: 'pg1', ToPageID: 'pg2', Label: 'A', CreatedAt: new Date() });
    await useCases.create({ FromPageID: 'pg2', ToPageID: 'pg3', Label: 'B', CreatedAt: new Date() });
    const toPg3 = await useCases.getByToPage('pg3');
    expect(toPg3.length).toBe(1);
    expect(toPg3[0].Label).toBe('B');
  });

  it('deletes a workflow', async () => {
    const created = await useCases.create({ FromPageID: 'pg1', ToPageID: 'pg2', Label: 'A', CreatedAt: new Date() });
    await useCases.delete(created.WorkflowID);
    const found = await useCases.getById(created.WorkflowID);
    expect(found).toBeNull();
  });
}); 