/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and obtain a JWT
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
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid credentials
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
});

export default withCORS(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.issues });
  const { email, password } = parse.data;
  const userRepo = new UserRepository();
  const auth = new AuthUseCases(userRepo);
  try {
    const { token, user } = await auth.login(email, password);
    // Omit PasswordHash from response
    const { PasswordHash, ...userSafe } = user;
    res.status(200).json({ token, user: userSafe });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}); 