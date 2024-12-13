import { useRouter } from 'next/navigation';
import { Menu, MenuType, MenuStatus } from '@/types/menus';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Calendar, Tag, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useMenuStore } from '@/stores/menus-store';

interface MenuCardProps {
  menu: Menu;
}

const menuTypeLabels: Record<keyof typeof MenuType, string> = {
  DAILY: '日常',
  WEEKLY: '每周',
  HOLIDAY: '节日',
  SPECIAL: '特别',
  SHARE_RECORD: '分享记录',
};

const menuStatusColors: Record<keyof typeof MenuStatus, string> = {
  DRAFT: 'bg-yellow-100 text-yellow-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-100 text-gray-800',
};

export function MenuCard({ menu }: MenuCardProps) {
  const router = useRouter();
  const { deleteMenu } = useMenuStore();

  const handleDelete = async () => {
    if (confirm('确定要删除这个菜单吗？')) {
      try {
        await deleteMenu(menu.id);
      } catch (error) {
        console.error('删除菜单失败:', error);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {menu.name}
              <Badge className={cn('text-xs', menuStatusColors[menu.status])}>
                {menu.status === 'DRAFT' ? '草稿' : menu.status === 'PUBLISHED' ? '已发布' : '已归档'}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Calendar className="mr-1 h-3 w-3" />
                {format(new Date(menu.startDate), 'MM.dd')} - {format(new Date(menu.endDate), 'MM.dd')}
              </Badge>
              <Badge variant="secondary">
                {menuTypeLabels[menu.type]}
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
              <DropdownMenuItem onClick={() => router.push(`/menus/${menu.id}/share`)}>
                分享
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-4">
          {menu.description && (
            <p className="text-sm text-muted-foreground">{menu.description}</p>
          )}
          {menu.tags?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Tag className="h-4 w-4" />
                标签
              </h4>
              <div className="flex flex-wrap gap-1">
                {menu.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push(`/menus/${menu.id}`)}>
          查看详情
        </Button>
        <Button variant="outline" size="sm" onClick={() => router.push(`/menus/${menu.id}/share`)}>
          <Share2 className="mr-1 h-4 w-4" />
          分享
        </Button>
      </CardFooter>
    </Card>
  );
}
