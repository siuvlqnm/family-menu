'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, '菜品名称至少2个字符'),
  description: z.string().min(10, '描述至少10个字符'),
  cookingTime: z.string().min(1, '请选择烹饪时间'),
  difficulty: z.string().min(1, '请选择难度'),
  servings: z.string().min(1, '请选择份量'),
  ingredients: z.array(z.object({
    name: z.string().min(1, '请输入食材名称'),
    amount: z.string().min(1, '请输入用量'),
  })),
  steps: z.array(z.string().min(1, '请输入烹饪步骤')),
  tips: z.array(z.string()),
});

// 模拟数据，实际应该从API获取
const dish = {
  id: '1',
  name: '红烧肉',
  description: '经典的中国菜，口感软烂，味道浓郁',
  cookingTime: '45分钟',
  difficulty: '中等',
  servings: '4人份',
  ingredients: [
    { name: '五花肉', amount: '500g' },
    { name: '生抽', amount: '2勺' },
  ],
  steps: [
    '五花肉切块，冷水下锅焯烫，去除血水',
    '锅中放油，爆香八角桂皮',
  ],
  tips: [
    '选用三层肉（五花肉）最佳，肥瘦均匀',
    '焯烫时加入几片姜片可以去腥',
  ],
};

export default function DishEditPage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: dish.name,
      description: dish.description,
      cookingTime: dish.cookingTime,
      difficulty: dish.difficulty,
      servings: dish.servings,
      ingredients: dish.ingredients,
      steps: dish.steps,
      tips: dish.tips,
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="container space-y-6 py-6">
      <PageHeader
        title="编辑菜品"
        actions={[
          {
            label: '取消',
            variant: 'outline',
            onClick: () => router.back(),
          },
          {
            label: '保存',
            onClick: form.handleSubmit(onSubmit),
          },
        ]}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>菜品名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入菜品名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>描述</FormLabel>
                    <FormControl>
                      <Textarea placeholder="请输入菜品描述" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="cookingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>烹饪时间</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择烹饪时间" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15分钟">15分钟</SelectItem>
                          <SelectItem value="30分钟">30分钟</SelectItem>
                          <SelectItem value="45分钟">45分钟</SelectItem>
                          <SelectItem value="60分钟">60分钟</SelectItem>
                          <SelectItem value="90分钟">90分钟</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>难度</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择难度" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="简单">简单</SelectItem>
                          <SelectItem value="中等">中等</SelectItem>
                          <SelectItem value="困难">困难</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="servings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>份量</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择份量" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1人份">1人份</SelectItem>
                          <SelectItem value="2人份">2人份</SelectItem>
                          <SelectItem value="4人份">4人份</SelectItem>
                          <SelectItem value="6人份">6人份</SelectItem>
                          <SelectItem value="8人份">8人份</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>食材清单</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {form.watch('ingredients').map((_, index) => (
                    <div key={index} className="flex gap-4">
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="食材名称" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.amount`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="用量" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const ingredients = form.getValues('ingredients');
                          ingredients.splice(index, 1);
                          form.setValue('ingredients', ingredients);
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const ingredients = form.getValues('ingredients');
                      ingredients.push({ name: '', amount: '' });
                      form.setValue('ingredients', ingredients);
                    }}
                  >
                    添加食材
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>烹饪步骤</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {form.watch('steps').map((_, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border">
                          {index + 1}
                        </div>
                        <FormField
                          control={form.control}
                          name={`steps.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="请输入步骤说明" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const steps = form.getValues('steps');
                            steps.splice(index, 1);
                            form.setValue('steps', steps);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const steps = form.getValues('steps');
                        steps.push('');
                        form.setValue('steps', steps);
                      }}
                    >
                      添加步骤
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>小贴士</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {form.watch('tips').map((_, index) => (
                      <div key={index} className="flex gap-4">
                        <FormField
                          control={form.control}
                          name={`tips.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="请输入小贴士" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const tips = form.getValues('tips');
                            tips.splice(index, 1);
                            form.setValue('tips', tips);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const tips = form.getValues('tips');
                        tips.push('');
                        form.setValue('tips', tips);
                      }}
                    >
                      添加小贴士
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
