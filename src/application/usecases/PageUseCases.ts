import { PageRepository } from '../../infrastructure/repositories/PageRepository';
import { Page } from '../../core/entities/Page';

export class PageUseCases {
  private pageRepo: PageRepository;

  constructor(pageRepo: PageRepository) {
    this.pageRepo = pageRepo;
  }

  async create(page: Omit<Page, 'PageID' | 'CreatedAt' | 'UpdatedAt'>) {
    return this.pageRepo.create(page);
  }

  async getById(pageId: string): Promise<Page | null> {
    return this.pageRepo.findById(pageId);
  }

  async getByProject(projectId: string): Promise<Page[]> {
    return this.pageRepo.findByProject(projectId);
  }

  async update(pageId: string, data: Partial<Page>) {
    return this.pageRepo.update(pageId, data);
  }

  async delete(pageId: string) {
    return this.pageRepo.delete(pageId);
  }
} 