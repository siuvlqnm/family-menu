import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, registerSchema } from '../types/auth';
import { AuthService } from '../services/auth';
import { createDb } from '../db';

const auth = new Hono();

// 用户注册
auth.post(
  '/register',
  zValidator('json', registerSchema),
  async (c) => {
    const input = c.req.valid('json');
    const db = createDb(c.env.DB);
    const authService = new AuthService(db, c);
    
    const result = await authService.register(input);
    return c.json(result, 201);
  }
);

// 用户登录
auth.post(
  '/login',
  zValidator('json', loginSchema),
  async (c) => {
    const input = c.req.valid('json');
    const db = createDb(c.env.DB);
    const authService = new AuthService(db, c);
    
    const result = await authService.login(input);
    return c.json(result);
  }
);

export { auth as authRouter };
