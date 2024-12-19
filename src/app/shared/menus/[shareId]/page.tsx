'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useMenuStore } from '@/stores/menus-store'
import { MenuType, MealTime, MenuItem, MenuWithItems } from '@/types/menus'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingSpinner } from '@/components/ui/loading'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { AddMenuItems } from '@/components/menus/add-menu-items'
import { Button } from '@/components/ui/button'
import { Edit2, Plus } from 'lucide-react'

export const runtime = 'edge';

function MenuTypeBadge({ type }: { type: keyof typeof MenuType }) {
  switch (type) {
    case "DAILY":
      return <Badge variant="outline">日常</Badge>
    case "WEEKLY":
      return <Badge variant="outline">每周</Badge>
    case "HOLIDAY":
      return <Badge variant="outline">节日</Badge>
    case "SPECIAL":
      return <Badge variant="outline">特别</Badge>
    default:
      return "未知"
  }
}

function MealTimeLabel({ mealTime }: { mealTime: keyof typeof MealTime }) {
  switch (mealTime) {
    case "BREAKFAST":
      return <span className="font-medium">早餐</span>
    case "LUNCH":
      return <span className="font-medium">午餐</span>
    case "DINNER":
      return <span className="font-medium">晚餐</span>
    case "SNACK":
      return <span className="font-medium">点心</span>
    default:
      return "未知"
  }
}

export default function SharedMenuPage() {
  const params = useParams() as { shareId: string }
  const { shareId } = params

  const router = useRouter()
  const { menu, loading, error, fetchSharedMenu, updateMenuItem, createMenuItem } = useMenuStore()
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editingValues, setEditingValues] = useState<{
    servings?: number
    note?: string
  }>({})
  const [showAddItems, setShowAddItems] = useState(false)

  useEffect(() => {
    if (shareId) {
      console.log('Fetching shared menu:', shareId)
      fetchSharedMenu(shareId)
    }
  }, [shareId, fetchSharedMenu])

  const handleEditStart = (itemId: string, servings?: number, note?: string) => {
    setEditingItem(itemId)
    setEditingValues({ servings, note })
  }

  const handleEditSave = async (itemId: string) => {
    try {
      await updateMenuItem(menu!.id, itemId, editingValues)
      setEditingItem(null)
      setEditingValues({})
    } catch (error) {
      console.error('Failed to update menu item:', error)
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

   // 修改菜品数据的组织逻辑
   const menuItemsByDate = (menu.items || []).reduce((acc, item) => {
    // 确保日期格式统一，使用 YYYY-MM-DD 格式
    const date = new Date(item.date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = {
        BREAKFAST: [],
        LUNCH: [],
        DINNER: [],
        SNACK: [],
      };
    }
    // 确保 item.mealTime 是有效的用餐时间
    const mealTime = item.mealTime as keyof typeof MealTime;
    if (acc[date][mealTime]) {
      acc[date][mealTime].push(item);
    }
    return acc;
  }, {} as Record<string, Record<keyof typeof MealTime, MenuItem[]>>);

  // 排序日期
  const sortedDates = Object.keys(menuItemsByDate).sort()

  // 检查是否允许编辑
  // const canEdit = menu?.allowEdit ?? false
  const canEdit = true
  return (
    <div className="container space-y-6 py-6">
      <PageHeader
        title={menu.name}
        description={menu.description}
        actions={canEdit ? [
          {
            label: '添加菜品',
            icon: Plus,
            onClick: () => setShowAddItems(true),
          },
        ] : undefined}
      />

      {/* 添加菜品对话框 */}
      {canEdit && (
        <Dialog open={showAddItems} onOpenChange={setShowAddItems}>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>添加菜品</DialogTitle>
              <DialogDescription>
                选择要添加到菜单的菜品
              </DialogDescription>
            </DialogHeader>
            <AddMenuItems
              menuId={menu.id}
              onSuccess={() => {
                setShowAddItems(false)
                fetchSharedMenu(shareId)
              }}
            />
          </DialogContent>
        </Dialog>
      )}

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
                    <div key={mealTime} className="space-y-2">
                      <MealTimeLabel mealTime={mealTime as keyof typeof MealTime} />
                      <div className="grid gap-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            {editingItem === item.id ? (
                              <div className="flex w-full items-center space-x-4">
                                <div className="space-y-1">
                                  <div className="font-medium">{item.recipe.name}</div>
                                  {item.note && (
                                    <div className="text-sm text-muted-foreground">
                                      {item.note}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm text-muted-foreground">
                                    {item.servings && `${item.servings} 份`}
                                  </div>
                                  {canEdit && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleEditStart(item.id, item.servings, item.note)
                                      }
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="space-y-1">
                                  <div className="font-medium">{item.recipe.name}</div>
                                  {item.note && (
                                    <div className="text-sm text-muted-foreground">
                                      {item.note}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm text-muted-foreground">
                                    {item.servings && `${item.servings} 份`}
                                  </div>
                                  {canEdit && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleEditSave(item.id)
                                      }
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
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
              <p className="text-sm text-muted-foreground">
                这个菜单还没有添加任何菜品
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
