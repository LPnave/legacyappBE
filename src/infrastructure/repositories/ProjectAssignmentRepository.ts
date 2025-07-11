import { PrismaClient } from '../../../generated/prisma';
import { ProjectAssignment } from '../../core/entities/ProjectAssignment';

const prisma = new PrismaClient();

export class ProjectAssignmentRepository {
  async create(assignment: Omit<ProjectAssignment, 'AssignmentID'>): Promise<ProjectAssignment> {
    const created = await prisma.projectAssignment.create({ data: assignment });
    return created as ProjectAssignment;
  }

  async findById(assignmentId: string): Promise<ProjectAssignment | null> {
    return prisma.projectAssignment.findUnique({ where: { AssignmentID: assignmentId } }) as Promise<ProjectAssignment | null>;
  }

  async findByProject(projectId: string): Promise<ProjectAssignment[]> {
    return prisma.projectAssignment.findMany({ where: { ProjectID: projectId } }) as Promise<ProjectAssignment[]>;
  }

  async findByUser(userId: string): Promise<ProjectAssignment[]> {
    return prisma.projectAssignment.findMany({ where: { UserID: userId } }) as Promise<ProjectAssignment[]>;
  }

  async delete(assignmentId: string): Promise<void> {
    await prisma.projectAssignment.delete({ where: { AssignmentID: assignmentId } });
  }
} 