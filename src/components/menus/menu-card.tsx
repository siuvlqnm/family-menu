import { Menu } from '@/types/menus'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { MenuType, MenuStatus } from '@/types/menus'
import { cn } from '@/lib/utils'
import { Users, Calendar, Tag, Edit, Eye, Trash2 } from 'lucide-react'

interface MenuCardProps {
  menu: Menu
  showFamilyGroup?: boolean
  onEdit?: () => void
  onView?: () => void
  onDelete?: () => void
  className?: string
}

export function MenuCard({
  menu,
  showFamilyGroup = true,
  onEdit,
  onView,
  onDelete,
  className,
}: MenuCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      {menu.coverImage && (
        <div className="relative aspect-video">
          <img
            src={menu.coverImage}
            alt={menu.name}
            className="h-full w-full object-cover"
          />
          {showFamilyGroup && menu.familyGroupId && (
            <div className="absolute right-2 top-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {menu.familyGroupName || '家庭组菜单'}
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{menu.name}</h3>
            {menu.description && (
              <p className="text-sm text-muted-foreground">{menu.description}</p>
            )}
          </div>
          <Badge
            variant={
              menu.status === 'PUBLISHED'
                ? 'default'
                : menu.status === 'DRAFT'
                ? 'secondary'
                : 'outline'
            }
          >
            {MenuStatus[menu.status]}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            {MenuType[menu.type]}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(menu.startDate), 'MM/dd', { locale: zhCN })} -{' '}
            {format(new Date(menu.endDate), 'MM/dd', { locale: zhCN })}
          </Badge>
        </div>

        {menu.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {menu.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="text-sm text-muted-foreground">
          创建于 {format(new Date(menu.createdAt), 'PPP', { locale: zhCN })}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {onView && (
          <Button variant="ghost" size="sm" onClick={onView}>
            <Eye className="h-4 w-4" />
            <span className="sr-only">查看</span>
          </Button>
        )}
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">编辑</span>
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">删除</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
