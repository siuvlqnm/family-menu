'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Clock, ChefHat, UtensilsCrossed, Users, Star } from 'lucide-react';

// 模拟数据，实际应该从API获取
const dish = {
  id: '1',
  name: '红烧肉',
  description: '经典的中国菜，口感软烂，味道浓郁',
  tags: ['肉类', '红烧', '家常菜'],
  cookingTime: '45分钟',
  difficulty: '中等',
  servings: '4人份',
  rating: 4.5,
  ingredients: [
    { name: '五花肉', amount: '500g' },
    { name: '生抽', amount: '2勺' },
    { name: '老抽', amount: '1勺' },
    { name: '料酒', amount: '2勺' },
    { name: '冰糖', amount: '适量' },
    { name: '八角', amount: '2个' },
    { name: '桂皮', amount: '1块' },
  ],
  steps: [
    '五花肉切块，冷水下锅焯烫，去除血水',
    '锅中放油，爆香八角桂皮',
    '放入五花肉翻炒上色',
    '加入生抽、老抽、料酒调味',
    '加入适量开水，大火烧开后转小火慢炖',
    '加入冰糖，继续炖至肉质软烂',
    '大火收汁即可出锅',
  ],
  tips: [
    '选用三层肉（五花肉）最佳，肥瘦均匀',
    '焯烫时加入几片姜片可以去腥',
    '炖煮时间越长，肉质越软烂',
  ],
};

export default function DishDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  return (
    <div className="container space-y-6 py-6">
      <PageHeader
        title={dish.name}
        actions={[
          {
            label: '编辑',
            onClick: () => router.push(`/dishes/${params.id}/edit`),
          },
          {
            label: '加入菜单',
            onClick: () => {/* TODO */},
          },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  {dish.cookingTime}
                </Badge>
                <Badge variant="secondary">
                  <ChefHat className="mr-1 h-3 w-3" />
                  {dish.difficulty}
                </Badge>
                <Badge variant="secondary">
                  <Users className="mr-1 h-3 w-3" />
                  {dish.servings}
                </Badge>
                <Badge variant="secondary">
                  <Star className="mr-1 h-3 w-3" />
                  {dish.rating}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{dish.description}</p>
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-2">
                  {dish.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>食材清单</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dish.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-sm">{ingredient.name}</span>
                    <span className="text-sm text-muted-foreground">{ingredient.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>烹饪步骤</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dish.steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>小贴士</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dish.tips.map((tip, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
