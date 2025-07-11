import { ProjectRepository } from '../../infrastructure/repositories/ProjectRepository';
import { Project } from '../../core/entities/Project';
import { ProjectStatus } from '../../core/enums/ProjectStatus';

export class ProjectUseCases {
  private projectRepo: ProjectRepository;

  constructor(projectRepo: ProjectRepository) {
    this.projectRepo = projectRepo;
  }

  async create(title: string, createdBy: string, status: ProjectStatus, description?: string) {
    return this.projectRepo.create({
      Title: title,
      Description: description,
      Status: status,
      CreatedBy: createdBy,
    });
  }

  async getById(projectId: string): Promise<Project | null> {
    return this.projectRepo.findById(projectId);
  }

  async getAll(): Promise<Project[]> {
    return this.projectRepo.findAll();
  }

  async update(projectId: string, data: Partial<Omit<Project, 'ProjectID' | 'CreatedAt' | 'UpdatedAt'>> & { CreatedBy?: string }) {
    return this.projectRepo.update(projectId, data);
  }

  async delete(projectId: string) {
    return this.projectRepo.delete(projectId);
  }
} 