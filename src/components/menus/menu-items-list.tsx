'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import { MenuItem, MealTime } from '@/types/menus'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { GripVertical, MoreVertical, Edit, Trash2 } from 'lucide-react'

interface MenuItemsListProps {
  items: MenuItem[]
  mealTime: keyof typeof MealTime
  onReorder: (items: MenuItem[]) => void
  onDelete: (itemId: string) => void
}

export function MenuItemsList({
  items,
  mealTime,
  onReorder,
  onDelete,
}: MenuItemsListProps) {
  const router = useRouter()
  const [orderedItems, setOrderedItems] = useState(items)

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newItems = Array.from(orderedItems)
    const [removed] = newItems.splice(result.source.index, 1)
    newItems.splice(result.destination.index, 0, removed)

    // 更新每个项目的 orderIndex
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      orderIndex: index,
    }))

    setOrderedItems(updatedItems)
    onReorder(updatedItems)
  }

  const getMealTimeLabel = (mealTime: keyof typeof MealTime) => {
    switch (mealTime) {
      case 'BREAKFAST':
        return '早餐'
      case 'LUNCH':
        return '午餐'
      case 'DINNER':
        return '晚餐'
      case 'SNACK':
        return '小吃'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{getMealTimeLabel(mealTime)}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            router.push(
              `/menus/${orderedItems[0]?.menuId}/items/new?mealTime=${mealTime}`
            )
          }
        >
          添加菜品
        </Button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`meal-time-${mealTime}`}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {orderedItems.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center justify-between rounded-lg border p-3 ${
                        snapshot.isDragging ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab text-muted-foreground"
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {item.recipe.name}
                          </div>
                          {item.note && (
                            <div className="text-sm text-muted-foreground">
                              {item.note}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-muted-foreground">
                          {item.servings && `${item.servings} 份`}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">打开菜单</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/menus/${item.menuId}/items/${item.id}/edit`
                                )
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              编辑
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  删除
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>确认删除</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    您确定要删除这个菜品吗？此操作无法撤销。
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>取消</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onDelete(item.id)}
                                  >
                                    删除
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
