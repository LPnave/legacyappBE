import { PrismaClient } from '../../../generated/prisma';
import { Project } from '../../core/entities/Project';
import { ProjectStatus } from '../../core/enums/ProjectStatus';

const prisma = new PrismaClient();

export class ProjectRepository {
  async create(project: Omit<Project, 'ProjectID' | 'CreatedAt' | 'UpdatedAt'> & { CreatedBy: string }): Promise<Project> {
    const created = await prisma.project.create({
      data: {
        Title: project.Title,
        Description: project.Description,
        Status: project.Status as any, // Cast to Prisma enum
        CreatedBy: { connect: { UserID: project.CreatedBy } },
      },
      include: { CreatedBy: true },
    });
    return {
      ProjectID: created.ProjectID,
      Title: created.Title,
      Description: created.Description ?? undefined,
      Status: created.Status as ProjectStatus,
      CreatedBy: created.CreatedByID,
      CreatedAt: created.CreatedAt,
      UpdatedAt: created.UpdatedAt,
    };
  }

  async findById(projectId: string): Promise<Project | null> {
    const found = await prisma.project.findUnique({
      where: { ProjectID: projectId },
      include: { CreatedBy: true, _count: { select: { Pages: true } } },
    });
    if (!found) return null;
    return {
      ProjectID: found.ProjectID,
      Title: found.Title,
      Description: found.Description ?? undefined,
      Status: found.Status as ProjectStatus,
      CreatedBy: found.CreatedByID,
      CreatedByName: found.CreatedBy?.Name ?? '',
      CreatedAt: found.CreatedAt,
      UpdatedAt: found.UpdatedAt,
      pagesCount: found._count?.Pages ?? 0,
    };
  }

  async findAll(): Promise<Project[]> {
    const projects = await prisma.project.findMany({ include: { CreatedBy: true, _count: { select: { Pages: true } } } });
    return projects.map((p) => ({
      ProjectID: p.ProjectID,
      Title: p.Title,
      Description: p.Description ?? undefined,
      Status: p.Status as ProjectStatus,
      CreatedBy: p.CreatedByID,
      CreatedByName: p.CreatedBy?.Name ?? '',
      CreatedAt: p.CreatedAt,
      UpdatedAt: p.UpdatedAt,
      pagesCount: p._count?.Pages ?? 0,
    }));
  }

  async update(projectId: string, data: Partial<Omit<Project, 'ProjectID' | 'CreatedAt' | 'UpdatedAt'>> & { CreatedBy?: string }): Promise<Project | null> {
    const updateData: any = { ...data };
    if (data.Status) {
      updateData.Status = data.Status as any;
    }
    if (data.CreatedBy) {
      updateData.CreatedBy = { connect: { UserID: data.CreatedBy } };
    } else {
      delete updateData.CreatedBy;
    }
    const updated = await prisma.project.update({
      where: { ProjectID: projectId },
      data: updateData,
      include: { CreatedBy: true },
    });
    return {
      ProjectID: updated.ProjectID,
      Title: updated.Title,
      Description: updated.Description ?? undefined,
      Status: updated.Status as ProjectStatus,
      CreatedBy: updated.CreatedByID,
      CreatedAt: updated.CreatedAt,
      UpdatedAt: updated.UpdatedAt,
    };
  }

  async delete(projectId: string): Promise<void> {
    await prisma.project.delete({ where: { ProjectID: projectId } });
  }
} 