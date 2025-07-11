import type { NextApiRequest, NextApiResponse } from 'next';
import { UserRepository } from '../../../src/infrastructure/repositories/UserRepository';
import { withCORS } from '../../../src/api/_middleware/cors';
import { Role } from '../../../src/core/enums/Role';

export default withCORS(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const userRepo = new UserRepository();
  const { id } = req.query;
  if (id && typeof id === 'string') {
    const user = await userRepo.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ user });
  }
  const users = await userRepo.findAllByRole(Role.PM);
  res.status(200).json({ users });
}); 