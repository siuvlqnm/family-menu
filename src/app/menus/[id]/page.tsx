'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useAuthStore } from '@/stores/auth-store'
import { useMenuStore } from '@/stores/menus-store'
import { MenuType, MenuStatus, MealTime } from '@/types/menus'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingSpinner } from '@/components/ui/loading'
import { MenuItemsList } from '@/components/menus/menu-items-list'
import { Share2, Edit, Plus } from 'lucide-react'
import Image from 'next/image'

function MenuStatusBadge({ status }: { status: keyof typeof MenuStatus }) {
  const variant = status === 'draft' ? 'secondary' : status === 'published' ? 'default' : 'outline'
  const label = status === 'draft' ? '草稿' : status === 'published' ? '已发布' : '已归档'
  return <Badge variant={variant}>{label}</Badge>
}

function MenuTypeBadge({ type }: { type: keyof typeof MenuType }) {
  const label = type === 'daily' ? '日常' : type === 'weekly' ? '每周' : type === 'holiday' ? '节日' : '特别'
  return <Badge variant="outline">{label}</Badge>
}

export default function MenuDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { checkAuth } = useAuthStore()
  const { menu, loading, error, fetchMenu, updateMenuItems, deleteMenuItem } = useMenuStore()

  useEffect(() => {
    const isAuthed = checkAuth()
    if (!isAuthed) {
      router.replace('/login?from=/menus/' + params.id)
      return
    }
    fetchMenu(params.id)
  }, [checkAuth, fetchMenu, params.id, router])

  const handleReorderItems = async (items: typeof menu.items) => {
    try {
      await updateMenuItems(params.id, items)
      fetchMenu(params.id)
    } catch (error) {
      console.error('Failed to reorder menu items:', error)
    }
  }

  const handleDeleteMenuItem = async (itemId: string) => {
    try {
      await deleteMenuItem(params.id, itemId)
      fetchMenu(params.id)
    } catch (error) {
      console.error('Failed to delete menu item:', error)
    }
  }

  if (loading) {
    return (
      <div className="container py-6">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-6">
        <div className="rounded-lg bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="container py-6">
        <div className="rounded-lg bg-muted p-4">
          菜单不存在或已被删除
        </div>
      </div>
    )
  }

  // 按日期和用餐时间组织菜品
  const menuItemsByDate = menu.items.reduce((acc, item) => {
    const date = item.date
    if (!acc[date]) {
      acc[date] = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
      }
    }
    acc[date][item.mealTime].push(item)
    return acc
  }, {} as Record<string, Record<keyof typeof MealTime, typeof menu.items>>)

  // 排序日期
  const sortedDates = Object.keys(menuItemsByDate).sort()

  return (
    <div className="container space-y-6 py-6">
      <PageHeader
        title={menu.name}
        description={menu.description}
        backButton
        actions={[
          {
            label: '添加菜品',
            icon: Plus,
            onClick: () => router.push(`/menus/${menu.id}/items/new`),
          },
          {
            label: '分享',
            icon: Share2,
            onClick: () => router.push(`/menus/${menu.id}/share`),
          },
          {
            label: '编辑',
            icon: Edit,
            onClick: () => router.push(`/menus/${menu.id}/edit`),
          },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-[2fr,3fr]">
        {/* 左侧：菜单信息 */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg border">
            {menu.coverImage && (
              <div className="relative aspect-video">
                <Image
                  src={menu.coverImage}
                  alt={menu.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="space-y-4 p-4">
              <div className="flex flex-wrap gap-2">
                <MenuTypeBadge type={menu.type} />
                <MenuStatusBadge status={menu.status} />
                {menu.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">开始日期</span>
                  <span>{format(new Date(menu.startDate), 'yyyy年MM月dd日')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">结束日期</span>
                  <span>{format(new Date(menu.endDate), 'yyyy年MM月dd日')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">创建时间</span>
                  <span>{format(new Date(menu.createdAt), 'yyyy年MM月dd日')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">最后更新</span>
                  <span>{format(new Date(menu.updatedAt), 'yyyy年MM月dd日')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：菜品列表 */}
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="space-y-4">
              <h3 className="text-lg font-semibold">
                {format(new Date(date), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
              </h3>
              <div className="space-y-4">
                {Object.entries(menuItemsByDate[date]).map(([mealTime, items]) => {
                  if (items.length === 0) return null
                  return (
                    <div key={mealTime}>
                      <MenuItemsList
                        items={items.sort((a, b) => a.orderIndex - b.orderIndex)}
                        mealTime={mealTime as keyof typeof MealTime}
                        onReorder={(reorderedItems) => handleReorderItems(reorderedItems)}
                        onDelete={handleDeleteMenuItem}
                      />
                    </div>
                  )
                })}
              </div>
              <Separator />
            </div>
          ))}

          {sortedDates.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="mb-2 text-lg font-medium">暂无菜品</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                点击添加菜品按钮开始规划您的菜单
              </p>
              <Button onClick={() => router.push(`/menus/${menu.id}/items/new`)}>
                <Plus className="mr-2 h-4 w-4" />
                添加菜品
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}