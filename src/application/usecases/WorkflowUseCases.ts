import { WorkflowRepository } from '../../infrastructure/repositories/WorkflowRepository';
import { Workflow } from '../../core/entities/Workflow';

export class WorkflowUseCases {
  private workflowRepo: WorkflowRepository;

  constructor(workflowRepo: WorkflowRepository) {
    this.workflowRepo = workflowRepo;
  }

  async create(workflow: Omit<Workflow, 'WorkflowID'>) {
    return this.workflowRepo.create(workflow);
  }

  async getById(workflowId: string): Promise<Workflow | null> {
    return this.workflowRepo.findById(workflowId);
  }

  async getByFromPage(pageId: string): Promise<Workflow[]> {
    return this.workflowRepo.findByFromPage(pageId);
  }

  async getByToPage(pageId: string): Promise<Workflow[]> {
    return this.workflowRepo.findByToPage(pageId);
  }

  async delete(workflowId: string) {
    return this.workflowRepo.delete(workflowId);
  }
} 