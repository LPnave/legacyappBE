import { PrismaClient, User as PrismaUser } from '../../../generated/prisma';
import { User } from '../../core/entities/User';
import { Role } from '../../core/enums/Role';

const prisma = new PrismaClient();

export class UserRepository {
  async create(user: Omit<User, 'UserID' | 'CreatedAt' | 'UpdatedAt'>): Promise<User> {
    const created = await prisma.user.create({ data: user });
    return created as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { Email: email } }) as Promise<User | null>;
  }

  async findById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { UserID: userId } }) as Promise<User | null>;
  }

  async update(userId: string, data: Partial<User>): Promise<User | null> {
    return prisma.user.update({ where: { UserID: userId }, data }) as Promise<User | null>;
  }

  async delete(userId: string): Promise<void> {
    await prisma.user.delete({ where: { UserID: userId } });
  }

  async findAllByRole(role: Role): Promise<User[]> {
    return prisma.user.findMany({ where: { Role: role } }) as Promise<User[]>;
  }
} 