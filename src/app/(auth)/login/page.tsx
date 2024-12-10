'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  userName: z.string().min(3, '用户名至少3个字符').max(20, '用户名最多20个字符'),
  password: z.string().min(6, '密码至少6个字符'),
});

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await login(values.userName, values.password);
      router.push('/dashboard');
    } catch (error) {
      // 错误已经在store中处理
      console.error('Login failed:', error);
    }
  }

  return (
    <div className="container relative min-h-screen grid flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-6 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600 to-orange-800" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.logo className="mr-2 h-6 w-6 text-white" />
          <span>家庭菜单</span>
        </div>
        <div className="relative z-20 mt-6">
          <blockquote className="space-y-2">
            <p className="text-base font-medium">让美食相伴每一天</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center">
                <Icons.check className="mr-2 h-4 w-4" />
                智能规划每周菜单
              </li>
              <li className="flex items-center">
                <Icons.check className="mr-2 h-4 w-4" />
                营养搭配更均衡
              </li>
              <li className="flex items-center">
                <Icons.check className="mr-2 h-4 w-4" />
                分享美食好心情
              </li>
            </ul>
            <footer className="mt-4 text-xs text-orange-100">
              温馨提示：好的计划是美味的开始
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">登录</CardTitle>
              <CardDescription>
                输入您的账户信息以登录
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>用户名</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={loading}
                            placeholder="请输入用户名"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>密码</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="请输入密码"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    登录
                  </Button>
                </form>
              </Form>
              <div className="mt-4">
                <Button variant="link" className="px-0 font-normal" asChild>
                  <Link href="/forgot-password">忘记密码？</Link>
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                还没有账号？{' '}
                <Link href="/register" className="text-primary hover:underline">
                  立即注册
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
