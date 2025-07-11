import { PrismaClient } from '../../../generated/prisma';
import { Comment } from '../../core/entities/Comment';

const prisma = new PrismaClient();

export class CommentRepository {
  async create(comment: Omit<Comment, 'CommentID'>): Promise<Comment> {
    const created = await prisma.comment.create({ data: comment });
    return created as Comment;
  }

  async findById(commentId: string): Promise<Comment | null> {
    return prisma.comment.findUnique({ where: { CommentID: commentId } }) as Promise<Comment | null>;
  }

  async findByPage(pageId: string): Promise<Comment[]> {
    const comments = await prisma.comment.findMany({
      where: { PageID: pageId },
      include: { User: true },
      orderBy: { CreatedAt: 'asc' },
    });
    return comments.map((c) => ({
      ...c,
      UserName: c.User?.Name ?? '',
    }));
  }

  async delete(commentId: string): Promise<void> {
    await prisma.comment.delete({ where: { CommentID: commentId } });
  }
} 