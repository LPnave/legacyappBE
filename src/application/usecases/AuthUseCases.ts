import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { BcryptAdapter } from '../../infrastructure/adapters/BcryptAdapter';
import { JWTAdapter } from '../../infrastructure/adapters/JWTAdapter';
import { Role } from '../../core/enums/Role';

export class AuthUseCases {
  private userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  async register(email: string, password: string, role: Role, name?: string) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error('Email already registered');
    const hash = await BcryptAdapter.hash(password);
    const user = await this.userRepo.create({
      Email: email,
      PasswordHash: hash,
      Role: role,
      Name: name,
    });
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const valid = await BcryptAdapter.compare(password, user.PasswordHash);
    if (!valid) throw new Error('Invalid credentials');
    const token = JWTAdapter.sign({ userId: user.UserID, role: user.Role });
    return { token, user };
  }
} 