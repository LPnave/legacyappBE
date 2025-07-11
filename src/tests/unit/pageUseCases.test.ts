import { PageUseCases } from '../../application/usecases/PageUseCases';

describe('PageUseCases', () => {
  let pages: any[];
  let pageRepo: any;
  let useCases: PageUseCases;

  beforeEach(() => {
    pages = [];
    pageRepo = {
      create: async (data: any) => {
        const page = { ...data, PageID: 'pg-' + (pages.length + 1), CreatedAt: new Date(), UpdatedAt: new Date() };
        pages.push(page);
        return page;
      },
      findById: async (id: string) => pages.find(p => p.PageID === id) || null,
      findByProject: async (projectId: string) => pages.filter(p => p.ProjectID === projectId),
      update: async (id: string, data: any) => {
        const idx = pages.findIndex(p => p.PageID === id);
        if (idx === -1) return null;
        pages[idx] = { ...pages[idx], ...data };
        return pages[idx];
      },
      delete: async (id: string) => {
        const idx = pages.findIndex(p => p.PageID === id);
        if (idx !== -1) pages.splice(idx, 1);
      },
    };
    useCases = new PageUseCases(pageRepo);
  });

  it('creates a page', async () => {
    const page = await useCases.create({ ProjectID: 'proj-1', Title: 'Page 1', ScreenshotPath: '/img.png', Order: 1 });
    expect(page.Title).toBe('Page 1');
    expect(page.ProjectID).toBe('proj-1');
  });

  it('gets a page by id', async () => {
    const created = await useCases.create({ ProjectID: 'proj-1', Title: 'Page 1', ScreenshotPath: '/img.png', Order: 1 });
    const found = await useCases.getById(created.PageID);
    expect(found).toBeDefined();
    expect(found?.PageID).toBe(created.PageID);
  });

  it('gets pages by project', async () => {
    await useCases.create({ ProjectID: 'proj-1', Title: 'A', ScreenshotPath: '/a.png', Order: 1 });
    await useCases.create({ ProjectID: 'proj-2', Title: 'B', ScreenshotPath: '/b.png', Order: 2 });
    const proj1Pages = await useCases.getByProject('proj-1');
    expect(proj1Pages.length).toBe(1);
    expect(proj1Pages[0].Title).toBe('A');
  });

  it('updates a page', async () => {
    const created = await useCases.create({ ProjectID: 'proj-1', Title: 'Page', ScreenshotPath: '/img.png', Order: 1 });
    const updated = await useCases.update(created.PageID, { Title: 'Updated' });
    expect(updated?.Title).toBe('Updated');
  });

  it('deletes a page', async () => {
    const created = await useCases.create({ ProjectID: 'proj-1', Title: 'Page', ScreenshotPath: '/img.png', Order: 1 });
    await useCases.delete(created.PageID);
    const found = await useCases.getById(created.PageID);
    expect(found).toBeNull();
  });
}); 