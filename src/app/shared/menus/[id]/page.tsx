'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useMenuStore } from '@/stores/menus-store'
import { MenuType, MealTime } from '@/types/menus'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingSpinner } from '@/components/ui/loading'
import { Input } from '@/components/ui/input'
import { Plus, Edit2, Save, X } from 'lucide-react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AddMenuItems } from '@/components/menus/add-menu-items'

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
  const params = useParams() as { id: string }
  const { id } = params

  const router = useRouter()
  const searchParams = useSearchParams()
  const { menu, loading, error, fetchSharedMenu, updateMenuItem, createMenuItem } = useMenuStore()
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editingValues, setEditingValues] = useState<{
    servings?: number
    note?: string
  }>({})
  const [showAddItems, setShowAddItems] = useState(false)
  const token = searchParams.get('token')

  useEffect(() => {
    if (id && token) {
      fetchSharedMenu(id, token)
    }
  }, [id, token, fetchSharedMenu])

  const handleEditStart = (itemId: string, servings?: number, note?: string) => {
    setEditingItem(itemId)
    setEditingValues({ servings, note })
  }

  const handleEditCancel = () => {
    setEditingItem(null)
    setEditingValues({})
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

  // 按日期和用餐时间组织菜品
  const menuItemsByDate = menu.items.reduce((acc, item) => {
    const date = item.date
    if (!acc[date]) {
      acc[date] = {
        BREAKFAST: [],
        LUNCH: [],
        DINNER: [],
        SNACK: [],
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
        actions={[
          {
            label: '添加菜品',
            icon: Plus,
            onClick: () => setShowAddItems(true),
          },
        ]}
      />

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
            token={token || ''}
            onSuccess={() => {
              setShowAddItems(false)
              fetchSharedMenu(id, token || '')
            }}
          />
        </DialogContent>
      </Dialog>

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
                                <div className="flex-1 space-y-2">
                                  <div className="font-medium">{item.recipe.name}</div>
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      type="number"
                                      placeholder="份数"
                                      className="w-24"
                                      value={editingValues.servings}
                                      onChange={(e) =>
                                        setEditingValues({
                                          ...editingValues,
                                          servings: Number(e.target.value),
                                        })
                                      }
                                    />
                                    <Input
                                      placeholder="备注"
                                      value={editingValues.note}
                                      onChange={(e) =>
                                        setEditingValues({
                                          ...editingValues,
                                          note: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditSave(item.id)}
                                  >
                                    <Save className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleEditCancel}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
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
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleEditStart(item.id, item.servings, item.note)
                                    }
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
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
