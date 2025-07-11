import { CommentUseCases } from '../../application/usecases/CommentUseCases';

describe('CommentUseCases', () => {
  let comments: any[];
  let commentRepo: any;
  let useCases: CommentUseCases;

  beforeEach(() => {
    comments = [];
    commentRepo = {
      create: async (data: any) => {
        const comment = { ...data, CommentID: 'cmt-' + (comments.length + 1) };
        comments.push(comment);
        return comment;
      },
      findById: async (id: string) => comments.find(c => c.CommentID === id) || null,
      findByPage: async (pageId: string) => comments.filter(c => c.PageID === pageId),
      delete: async (id: string) => {
        const idx = comments.findIndex(c => c.CommentID === id);
        if (idx !== -1) comments.splice(idx, 1);
      },
    };
    useCases = new CommentUseCases(commentRepo);
  });

  it('creates a comment', async () => {
    const cmt = await useCases.create({ PageID: 'pg1', UserID: 'u1', Content: 'Nice!', CreatedAt: new Date() });
    expect(cmt.Content).toBe('Nice!');
    expect(cmt.PageID).toBe('pg1');
  });

  it('gets a comment by id', async () => {
    const created = await useCases.create({ PageID: 'pg1', UserID: 'u1', Content: 'Nice!', CreatedAt: new Date() });
    const found = await useCases.getById(created.CommentID);
    expect(found).toBeDefined();
    expect(found?.CommentID).toBe(created.CommentID);
  });

  it('gets comments by page', async () => {
    await useCases.create({ PageID: 'pg1', UserID: 'u1', Content: 'A', CreatedAt: new Date() });
    await useCases.create({ PageID: 'pg2', UserID: 'u2', Content: 'B', CreatedAt: new Date() });
    const pg1Cmts = await useCases.getByPage('pg1');
    expect(pg1Cmts.length).toBe(1);
    expect(pg1Cmts[0].Content).toBe('A');
  });

  it('deletes a comment', async () => {
    const created = await useCases.create({ PageID: 'pg1', UserID: 'u1', Content: 'A', CreatedAt: new Date() });
    await useCases.delete(created.CommentID);
    const found = await useCases.getById(created.CommentID);
    expect(found).toBeNull();
  });
}); 