import { ProjectAssignmentUseCases } from '../../application/usecases/ProjectAssignmentUseCases';

describe('ProjectAssignmentUseCases', () => {
  let assignments: any[];
  let assignmentRepo: any;
  let useCases: ProjectAssignmentUseCases;

  beforeEach(() => {
    assignments = [];
    assignmentRepo = {
      create: async (data: any) => {
        const assignment = { ...data, AssignmentID: 'as-' + (assignments.length + 1) };
        assignments.push(assignment);
        return assignment;
      },
      findById: async (id: string) => assignments.find(a => a.AssignmentID === id) || null,
      findByProject: async (projectId: string) => assignments.filter(a => a.ProjectID === projectId),
      findByUser: async (userId: string) => assignments.filter(a => a.UserID === userId),
      delete: async (id: string) => {
        const idx = assignments.findIndex(a => a.AssignmentID === id);
        if (idx !== -1) assignments.splice(idx, 1);
      },
    };
    useCases = new ProjectAssignmentUseCases(assignmentRepo);
  });

  it('creates an assignment', async () => {
    const as = await useCases.create({ ProjectID: 'p1', UserID: 'u1', AssignedAt: new Date() });
    expect(as.ProjectID).toBe('p1');
    expect(as.UserID).toBe('u1');
  });

  it('gets an assignment by id', async () => {
    const created = await useCases.create({ ProjectID: 'p1', UserID: 'u1', AssignedAt: new Date() });
    const found = await useCases.getById(created.AssignmentID);
    expect(found).toBeDefined();
    expect(found?.AssignmentID).toBe(created.AssignmentID);
  });

  it('gets assignments by project', async () => {
    await useCases.create({ ProjectID: 'p1', UserID: 'u1', AssignedAt: new Date() });
    await useCases.create({ ProjectID: 'p2', UserID: 'u2', AssignedAt: new Date() });
    const p1As = await useCases.getByProject('p1');
    expect(p1As.length).toBe(1);
    expect(p1As[0].UserID).toBe('u1');
  });

  it('gets assignments by user', async () => {
    await useCases.create({ ProjectID: 'p1', UserID: 'u1', AssignedAt: new Date() });
    await useCases.create({ ProjectID: 'p2', UserID: 'u2', AssignedAt: new Date() });
    const u2As = await useCases.getByUser('u2');
    expect(u2As.length).toBe(1);
    expect(u2As[0].ProjectID).toBe('p2');
  });

  it('deletes an assignment', async () => {
    const created = await useCases.create({ ProjectID: 'p1', UserID: 'u1', AssignedAt: new Date() });
    await useCases.delete(created.AssignmentID);
    const found = await useCases.getById(created.AssignmentID);
    expect(found).toBeNull();
  });
}); 