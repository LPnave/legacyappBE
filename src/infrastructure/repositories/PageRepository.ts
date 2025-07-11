import { PrismaClient } from '../../../generated/prisma';
import { Page } from '../../core/entities/Page';

const prisma = new PrismaClient();

export class PageRepository {
  async create(page: Omit<Page, 'PageID' | 'CreatedAt' | 'UpdatedAt'>): Promise<Page> {
    const created = await prisma.page.create({ data: page });
    return created as Page;
  }

  async findById(pageId: string): Promise<Page | null> {
    return prisma.page.findUnique({ where: { PageID: pageId } }) as Promise<Page | null>;
  }

  async findByProject(projectId: string): Promise<Page[]> {
    return prisma.page.findMany({ where: { ProjectID: projectId } }) as Promise<Page[]>;
  }

  async update(pageId: string, data: Partial<Page>): Promise<Page | null> {
    return prisma.page.update({ where: { PageID: pageId }, data }) as Promise<Page | null>;
  }

  async delete(pageId: string): Promise<void> {
    await prisma.page.delete({ where: { PageID: pageId } });
  }
} 