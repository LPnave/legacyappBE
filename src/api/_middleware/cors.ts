import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

const allowedOrigins = [
  'https://legacyapp-fe.vercel.app',
  'http://localhost:5173', // for local dev
];

export function withCORS(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    return handler(req, res);
  };
} 