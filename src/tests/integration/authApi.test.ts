import request from 'supertest';
import registerHandler from '../../../pages/api/auth/register';
import loginHandler from '../../../pages/api/auth/login';
import { createMocks } from 'node-mocks-http';

describe('Auth API', () => {
  it('registers and logs in a user', async () => {
    // Register
    const { req: regReq, res: regRes } = createMocks({
      method: 'POST',
      body: { email: 'apiuser@example.com', password: 'password123', role: 'PM', name: 'API User' },
    });
    await registerHandler(regReq as any, regRes as any);
    expect(regRes._getStatusCode()).toBe(201);
    const regData = JSON.parse(regRes._getData());
    expect(regData.user.Email).toBe('apiuser@example.com');

    // Login
    const { req: logReq, res: logRes } = createMocks({
      method: 'POST',
      body: { email: 'apiuser@example.com', password: 'password123' },
    });
    await loginHandler(logReq as any, logRes as any);
    expect(logRes._getStatusCode()).toBe(200);
    const logData = JSON.parse(logRes._getData());
    expect(logData.token).toBeDefined();
    expect(logData.user.Email).toBe('apiuser@example.com');
  });
}); 