'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MoreVertical, Check, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ShoppingListsPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container space-y-6 py-6">
      <PageHeader
        title="购物清单"
        actions={[
          {
            label: '新建清单',
            icon: Plus,
            onClick: () => {/* TODO */},
          },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle>周末采购清单</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="warning">进行中</Badge>
                  <span className="text-sm text-muted-foreground">2023-12-25</span>
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
                  <DropdownMenuItem>编辑</DropdownMenuItem>
                  <DropdownMenuItem>删除</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>完成进度</span>
                  <span className="text-muted-foreground">8/12 项</span>
                </div>
                <Progress value={66.67} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">待购买</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-muted-foreground">
                      <Check className="mr-1.5 h-4 w-4 text-muted-foreground" />
                      五花肉 500g
                    </li>
                    <li className="flex items-center text-sm text-muted-foreground">
                      <Check className="mr-1.5 h-4 w-4 text-muted-foreground" />
                      青菜 2斤
                    </li>
                    <li className="flex items-center text-sm text-muted-foreground line-through">
                      <Check className="mr-1.5 h-4 w-4 text-green-500" />
                      胡萝卜 500g
                    </li>
                    <li className="flex items-center text-sm text-muted-foreground line-through">
                      <Check className="mr-1.5 h-4 w-4 text-green-500" />
                      土豆 1kg
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">已购买</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-muted-foreground line-through">
                      <Check className="mr-1.5 h-4 w-4 text-green-500" />
                      胡萝卜 500g
                    </li>
                    <li className="flex items-center text-sm text-muted-foreground line-through">
                      <Check className="mr-1.5 h-4 w-4 text-green-500" />
                      土豆 1kg
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" size="sm">查看详情</Button>
            <Button variant="outline" size="sm">分享</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
