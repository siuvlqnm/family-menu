'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z
  .object({
    username: z.string().min(3, '用户名至少3个字符').max(20, '用户名最多20个字符'),
    name: z.string().min(2, '姓名至少2个字符').max(50, '姓名最多50个字符'),
    password: z.string().min(6, '密码至少6个字符'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError('');
    
    try {
      await register({
        username: values.username,
        name: values.name,
        password: values.password,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || '注册失败，请重试');
    } finally {
      setIsLoading(false);
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
            <p className="text-base font-medium">分享美食，共创生活</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center">
                <Icons.check className="mr-2 h-4 w-4" />
                记录家庭美食记忆
              </li>
              <li className="flex items-center">
                <Icons.check className="mr-2 h-4 w-4" />
                发现更多烹饪灵感
              </li>
              <li className="flex items-center">
                <Icons.check className="mr-2 h-4 w-4" />
                打造专属菜谱库
              </li>
            </ul>
            <footer className="mt-4 text-xs text-orange-100">
              温馨提示：加入我们，开启美食之旅
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">注册账号</CardTitle>
              <CardDescription>
                创建您的账号开始使用
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>用户名</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isLoading}
                            placeholder="请输入用户名"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>姓名</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isLoading}
                            placeholder="请输入姓名"
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
                            {...field}
                            disabled={isLoading}
                            placeholder="请输入密码"
                          />
                        </FormControl>
                        <FormDescription>
                          密码至少包含6个字符
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>确认密码</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            disabled={isLoading}
                            placeholder="请再次输入密码"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            我已阅读并同意
                            <Button variant="link" className="px-1 font-normal" asChild>
                              <Link href="/terms">服务条款</Link>
                            </Button>
                            和
                            <Button variant="link" className="px-1 font-normal" asChild>
                              <Link href="/privacy">隐私政策</Link>
                            </Button>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    注册
                  </Button>
                </form>
              </Form>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                已有账号？{' '}
                <Link href="/login" className="text-primary hover:underline">
                  立即登录
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
