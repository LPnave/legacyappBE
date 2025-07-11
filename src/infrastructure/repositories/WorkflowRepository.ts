import { PrismaClient } from '../../../generated/prisma';
import { Workflow } from '../../core/entities/Workflow';

const prisma = new PrismaClient();

export class WorkflowRepository {
  async create(workflow: Omit<Workflow, 'WorkflowID'>): Promise<Workflow> {
    const created = await prisma.workflow.create({ data: workflow });
    return created as Workflow;
  }

  async findById(workflowId: string): Promise<Workflow | null> {
    return prisma.workflow.findUnique({ where: { WorkflowID: workflowId } }) as Promise<Workflow | null>;
  }

  async findByFromPage(pageId: string): Promise<Workflow[]> {
    return prisma.workflow.findMany({ where: { FromPageID: pageId } }) as Promise<Workflow[]>;
  }

  async findByToPage(pageId: string): Promise<Workflow[]> {
    return prisma.workflow.findMany({ where: { ToPageID: pageId } }) as Promise<Workflow[]>;
  }

  async delete(workflowId: string): Promise<void> {
    await prisma.workflow.delete({ where: { WorkflowID: workflowId } });
  }
} 