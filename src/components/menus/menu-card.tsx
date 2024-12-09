import { useRouter } from 'next/navigation';
import { Menu } from '@/types/menu';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Calendar, Users } from 'lucide-react';

interface MenuCardProps {
  menu: Menu;
}

export function MenuCard({ menu }: MenuCardProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>{menu.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Calendar className="mr-1 h-3 w-3" />
                {menu.date}
              </Badge>
              <Badge variant="secondary">
                <Users className="mr-1 h-3 w-3" />
                {menu.servings} 人份
              </Badge>
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
              <DropdownMenuItem onClick={() => router.push(`/menus/${menu.id}/edit`)}>
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/menus/${menu.id}/duplicate`)}>
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
          <div>
            <h4 className="text-sm font-medium mb-2">菜品</h4>
            <div className="flex flex-wrap gap-1">
              {menu.dishes.map((dish) => (
                <Badge key={dish.id} variant="outline">
                  {dish.name}
                </Badge>
              ))}
            </div>
          </div>
          {menu.notes && (
            <div>
              <h4 className="text-sm font-medium mb-2">备注</h4>
              <p className="text-sm text-muted-foreground">{menu.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push(`/menus/${menu.id}`)}>
          查看详情
        </Button>
        <Button variant="outline" size="sm">
          生成购物清单
        </Button>
      </CardFooter>
    </Card>
  );
}
