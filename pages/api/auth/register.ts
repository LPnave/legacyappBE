/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 $ref: '#/components/schemas/Role'
 *               name:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - role
 *     responses:
 *       201:
 *         description: User registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Registration error
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { UserRepository } from '../../../src/infrastructure/repositories/UserRepository';
import { AuthUseCases } from '../../../src/application/usecases/AuthUseCases';
import { Role } from '../../../src/core/enums/Role';
import { JWTAdapter } from '../../../src/infrastructure/adapters/JWTAdapter';
import { withCORS } from '../../../src/api/_middleware/cors';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
  name: z.string().optional(),
});

export default withCORS(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.issues });
  const { email, password, role, name } = parse.data;
  const userRepo = new UserRepository();
  const auth = new AuthUseCases(userRepo);
  try {
    const user = await auth.register(email, password, role, name);
    // Omit PasswordHash from response
    const { PasswordHash, ...userSafe } = user;
    // Issue JWT token
    const token = JWTAdapter.sign({ userId: user.UserID, role: user.Role });
    res.status(201).json({ user: userSafe, token });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}); 