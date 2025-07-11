import { AuthUseCases } from '../../application/usecases/AuthUseCases';
import { Role } from '../../core/enums/Role';

describe('AuthUseCases', () => {
  const users: any[] = [];
  const userRepo = {
    findByEmail: async (email: string) => users.find(u => u.Email === email) || null,
    create: async (user: any) => {
      const newUser = { ...user, UserID: 'mock-id', CreatedAt: new Date(), UpdatedAt: new Date() };
      users.push(newUser);
      return newUser;
    },
  } as any;
  const auth = new AuthUseCases(userRepo);

  it('registers a new user', async () => {
    const user = await auth.register('test@example.com', 'password123', Role.PM, 'Test User');
    expect(user.Email).toBe('test@example.com');
    expect(user.Role).toBe(Role.PM);
  });

  it('logs in a registered user', async () => {
    const { token, user } = await auth.login('test@example.com', 'password123');
    expect(token).toBeDefined();
    expect(user.Email).toBe('test@example.com');
  });
}); 