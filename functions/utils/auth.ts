import { createHmac } from 'crypto';

// 生成密码哈希
export function hashPassword(password: string, secret: string): string {
  const hmac = createHmac('sha256', secret);
  return hmac.update(password).digest('hex');
}

// 验证密码
export function verifyPassword(password: string, hash: string, secret: string): boolean {
  const passwordHash = hashPassword(password, secret);
  return passwordHash === hash;
}
