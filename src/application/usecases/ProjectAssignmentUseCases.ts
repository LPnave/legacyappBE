import { ProjectAssignmentRepository } from '../../infrastructure/repositories/ProjectAssignmentRepository';
import { ProjectAssignment } from '../../core/entities/ProjectAssignment';

export class ProjectAssignmentUseCases {
  private assignmentRepo: ProjectAssignmentRepository;

  constructor(assignmentRepo: ProjectAssignmentRepository) {
    this.assignmentRepo = assignmentRepo;
  }

  async create(assignment: Omit<ProjectAssignment, 'AssignmentID'>) {
    return this.assignmentRepo.create(assignment);
  }

  async getById(assignmentId: string): Promise<ProjectAssignment | null> {
    return this.assignmentRepo.findById(assignmentId);
  }

  async getByProject(projectId: string): Promise<ProjectAssignment[]> {
    return this.assignmentRepo.findByProject(projectId);
  }

  async getByUser(userId: string): Promise<ProjectAssignment[]> {
    return this.assignmentRepo.findByUser(userId);
  }

  async delete(assignmentId: string) {
    return this.assignmentRepo.delete(assignmentId);
  }
} 