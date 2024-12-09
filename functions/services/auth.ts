import { eq } from 'drizzle-orm';
import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { sign } from 'hono/jwt';
import { Database, users } from '../db';
import { LoginInput, RegisterInput } from '../types/auth';
import { hashPassword, verifyPassword } from '../utils/auth';
import { nanoid } from '../utils/id';

export class AuthService {
  constructor(
    private readonly db: Database,
    private readonly c: Context
  ) {}

  private async generateToken(payload: { id: string; username: string; name: string }): Promise<string> {
    return await sign(payload, this.c.env.JWT_SECRET || 'secret');
  }

  // 用户注册
  async register(input: RegisterInput): Promise<{ token: string }> {
    // 检查用户名是否已存在
    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.username, input.username),
    });

    if (existingUser) {
      throw new HTTPException(400, { message: 'Username already exists' });
    }

    // 创建用户
    const [user] = await this.db.insert(users).values({
      id: nanoid(),
      username: input.username,
      name: input.name,
      password: await hashPassword(input.password, this.c.env.JWT_SECRET),
    }).returning();

    // 生成 token
    const token = await this.generateToken({
      id: user.id,
      username: user.username,
      name: user.name,
    });

    return { token };
  }

  // 用户登录
  async login(input: LoginInput): Promise<{ token: string }> {
    // 查找用户
    const user = await this.db.query.users.findFirst({
      where: eq(users.username, input.username),
    });

    if (!user || !(await verifyPassword(input.password, user.password, this.c.env.JWT_SECRET))) {
      throw new HTTPException(401, { message: 'Invalid username or password' });
    }

    // 生成 token
    const token = await this.generateToken({
      id: user.id,
      username: user.username,
      name: user.name,
    });

    return { token };
  }
}
