import { CommentRepository } from '../../infrastructure/repositories/CommentRepository';
import { Comment } from '../../core/entities/Comment';

export class CommentUseCases {
  private commentRepo: CommentRepository;

  constructor(commentRepo: CommentRepository) {
    this.commentRepo = commentRepo;
  }

  async create(comment: Omit<Comment, 'CommentID'>) {
    return this.commentRepo.create(comment);
  }

  async getById(commentId: string): Promise<Comment | null> {
    return this.commentRepo.findById(commentId);
  }

  async getByPage(pageId: string): Promise<Comment[]> {
    return this.commentRepo.findByPage(pageId);
  }

  async delete(commentId: string) {
    return this.commentRepo.delete(commentId);
  }
} 