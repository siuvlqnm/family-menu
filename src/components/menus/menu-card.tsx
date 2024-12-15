'use client'

import { Menu } from '@/types/menus'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { MenuType, MenuStatus } from '@/types/menus'
import { Users, Calendar, Tag, Eye, Edit, Trash2 } from 'lucide-react'
import { ContentCard } from '@/components/ui/content-card'

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
  const getStatusVariant = (status: keyof typeof MenuStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return 'default'
      case 'DRAFT':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <ContentCard
      coverImage={menu.coverImage}
      title={menu.name}
      description={menu.description}
      status={{
        label: MenuStatus[menu.status],
        variant: getStatusVariant(menu.status),
      }}
      topRightBadge={
        showFamilyGroup && menu.familyGroupId
          ? {
              label: menu.familyGroupName || '家庭组菜单',
              icon: <Users className="h-3 w-3" />,
              variant: 'secondary',
            }
          : undefined
      }
      badges={[
        {
          label: MenuType[menu.type],
          variant: 'outline',
        },
        {
          label: `${format(new Date(menu.startDate), 'MM/dd', { locale: zhCN })} - ${format(
            new Date(menu.endDate),
            'MM/dd',
            { locale: zhCN }
          )}`,
          icon: <Calendar className="h-3 w-3" />,
          variant: 'outline',
        },
        ...menu.tags.map((tag) => ({
          label: tag,
          icon: <Tag className="h-3 w-3" />,
          variant: 'secondary' as const,
        })),
      ]}
      createdAt={format(new Date(menu.createdAt), 'PPP', { locale: zhCN })}
      onView={onView && (() => onView())}
      onEdit={onEdit && (() => onEdit())}
      onDelete={onDelete && (() => onDelete())}
      actions={
        <>
          {onView && (
            <button type="button" onClick={onView}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">查看</span>
            </button>
          )}
          {onEdit && (
            <button type="button" onClick={onEdit}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">编辑</span>
            </button>
          )}
          {onDelete && (
            <button type="button" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">删除</span>
            </button>
          )}
        </>
      }
      className={className}
    />
  )
}
