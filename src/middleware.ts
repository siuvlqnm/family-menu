import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 需要保护的路由
const protectedRoutes: string[] = [];
// const protectedRoutes = ['/dashboard', '/recipes', '/menu', '/shopping'];
// 认证路由（已登录时不能访问）
const authRoutes: string[] = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // 从Authorization头中读取token
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  const isAuthenticated = !!token

  // 检查是否是受保护的路由
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  // 检查是否是认证路由
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // 处理受保护的路由
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }

  // 处理认证路由（已登录时重定向到首页）
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有需要保护的路由
     * /dashboard, /recipes, /menu, /shopping 等
     */
    '/dashboard/:path*',
    '/recipes/:path*',
    '/menu/:path*',
    '/shopping/:path*',
    /*
     * 匹配认证相关路由
     * /login, /register
     */
    '/login',
    '/register',
  ],
}
