import { ProjectUseCases } from '../../application/usecases/ProjectUseCases';
import { ProjectStatus } from '../../core/enums/ProjectStatus';

describe('ProjectUseCases', () => {
  let projects: any[];
  let projectRepo: any;
  let useCases: ProjectUseCases;

  beforeEach(() => {
    projects = [];
    projectRepo = {
      create: async (data: any) => {
        const project = { ...data, ProjectID: 'pid-' + (projects.length + 1), CreatedAt: new Date(), UpdatedAt: new Date() };
        projects.push(project);
        return project;
      },
      findById: async (id: string) => projects.find(p => p.ProjectID === id) || null,
      findAll: async () => projects,
      update: async (id: string, data: any) => {
        const idx = projects.findIndex(p => p.ProjectID === id);
        if (idx === -1) return null;
        projects[idx] = { ...projects[idx], ...data };
        return projects[idx];
      },
      delete: async (id: string) => {
        const idx = projects.findIndex(p => p.ProjectID === id);
        if (idx !== -1) projects.splice(idx, 1);
      },
    };
    useCases = new ProjectUseCases(projectRepo);
  });

  it('creates a project', async () => {
    const project = await useCases.create('Test Project', 'user-1', ProjectStatus.Working, 'desc');
    expect(project.Title).toBe('Test Project');
    expect(project.Status).toBe(ProjectStatus.Working);
    expect(project.Description).toBe('desc');
  });

  it('gets a project by id', async () => {
    const created = await useCases.create('Test Project', 'user-1', ProjectStatus.Working);
    const found = await useCases.getById(created.ProjectID);
    expect(found).toBeDefined();
    expect(found?.ProjectID).toBe(created.ProjectID);
  });

  it('gets all projects', async () => {
    await useCases.create('A', 'user-1', ProjectStatus.Working);
    await useCases.create('B', 'user-2', ProjectStatus.Review);
    const all = await useCases.getAll();
    expect(all.length).toBe(2);
  });

  it('updates a project', async () => {
    const created = await useCases.create('Test', 'user-1', ProjectStatus.Working);
    const updated = await useCases.update(created.ProjectID, { Title: 'Updated', Status: ProjectStatus.Ready });
    expect(updated?.Title).toBe('Updated');
    expect(updated?.Status).toBe(ProjectStatus.Ready);
  });

  it('deletes a project', async () => {
    const created = await useCases.create('Test', 'user-1', ProjectStatus.Working);
    await useCases.delete(created.ProjectID);
    const found = await useCases.getById(created.ProjectID);
    expect(found).toBeNull();
  });
}); 