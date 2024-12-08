import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { authRouter } from './routes/auth';
import { familyRouter } from './routes/family';
// import { menuRouter } from './routes/menu.ts.dev';
// import { recipeRouter } from './routes/recipe';
// import { recipeShareRouter } from './routes/recipe-share.ts.dev';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/error';

// 创建应用实例
const app = new Hono();

// 全局中间件
app.use('*', cors());
app.use('*', errorHandler());

// 健康检查
app.get('/api/', (c) => c.text('OK'));

// 认证路由
app.route('/api/auth', authRouter);

// 需要认证的路由
const protectedRoutes = app.use('*', authMiddleware);
protectedRoutes.route('/api/family', familyRouter);
// protectedRoutes.route('/api/menu', menuRouter);
// protectedRoutes.route('/api/recipe', recipeRouter);
// protectedRoutes.route('/api/recipe-share', recipeShareRouter);

// 404 处理
app.notFound((c) => {
  throw new HTTPException(404, { message: 'Not Found' });
});

export default app;
