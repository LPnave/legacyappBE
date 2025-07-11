import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { JWTAdapter } from '../../../src/infrastructure/adapters/JWTAdapter';

export function withAuth(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Allow unauthenticated access to login and register
    if (
      req.url?.startsWith('/api/auth/login') ||
      req.url?.startsWith('/api/auth/register')
    ) {
      return handler(req, res);
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.replace('Bearer ', '');
    const user = JWTAdapter.verify(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    // Attach user info to req for downstream handlers
    (req as any).user = user;
    return handler(req, res);
  };
} 