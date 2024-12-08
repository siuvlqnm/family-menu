import { z } from 'zod';

// 注册验证 schema
export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

// 登录验证 schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// 类型定义
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface AuthUser {
  id: string;
  email: string;
}
