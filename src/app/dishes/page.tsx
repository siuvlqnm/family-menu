'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Plus, Clock, UtensilsCrossed } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { DataTableLoading } from '@/components/ui/data-table/loading';
import { DataTableError } from '@/components/ui/data-table/error';

// 模拟数据，实际应该从API获取
const dishes = [
  {
    id: '1',
    name: '红烧肉',
    description: '经典的中国菜，口感软烂，味道浓郁',
    tags: ['肉类', '红烧', '家常菜'],
    cookingTime: '45分钟',
    difficulty: '中等',
  },
  {
    id: '2',
    name: '清炒小白菜',
    description: '简单易做的素菜，清淡爽口',
    tags: ['素菜', '炒菜', '快手菜'],
    cookingTime: '15分钟',
    difficulty: '简单',
  },
];

export default function DishesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, router]);

  if (false) { // 加载状态，实际应该根据数据加载状态判断
    return (
      <div className="container space-y-6 py-6">
        <PageHeader
          title="菜品管理"
          actions={[
            {
              label: '新建菜品',
              icon: Plus,
              onClick: () => router.push('/dishes/new'),
            },
          ]}
        />
        <DataTableLoading columnCount={3} rowCount={3} />
      </div>
    );
  }

  if (false) { // 错误状态，实际应该根据数据加载错误判断
    return (
      <div className="container space-y-6 py-6">
        <PageHeader
          title="菜品管理"
          actions={[
            {
              label: '新建菜品',
              icon: Plus,
              onClick: () => router.push('/dishes/new'),
            },
          ]}
        />
        <DataTableError message="加载失败" />
      </div>
    );
  }

  if (!dishes.length) {
    return (
      <div className="container space-y-6 py-6">
        <PageHeader
          title="菜品管理"
          actions={[
            {
              label: '新建菜品',
              icon: Plus,
              onClick: () => router.push('/dishes/new'),
            },
          ]}
        />
        <EmptyState
          icon={UtensilsCrossed}
          title="暂无菜品"
          description="创建一个新的菜品，开始记录您的拿手好菜"
          action={{
            label: '新建菜品',
            onClick: () => router.push('/dishes/new'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="container space-y-6 py-6">
      <PageHeader
        title="菜品管理"
        description={`共 ${dishes.length} 个菜品`}
        actions={[
          {
            label: '新建菜品',
            icon: Plus,
            onClick: () => router.push('/dishes/new'),
          },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dishes.map((dish) => (
          <Card key={dish.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{dish.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <Clock className="mr-1 h-3 w-3" />
                      {dish.cookingTime}
                    </Badge>
                    <Badge variant="secondary">{dish.difficulty}</Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">打开菜单</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/dishes/${dish.id}/edit`)}>
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/dishes/${dish.id}/duplicate`)}>
                      复制
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-4">
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
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/dishes/${dish.id}`)}>
                查看详情
              </Button>
              <Button variant="outline" size="sm">
                加入菜单
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
