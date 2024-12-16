'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { useRecipeStore } from '@/stores/recipes-store'
import { MealTime } from '@/types/menus'
import { Recipe } from '@/types/recipes'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Dialog } from '@/components/ui/dialog'
import Image from 'next/image'
import { Clock, Users } from 'lucide-react'
import { createMenuItem, getMenuItems } from '@/services/menus'
import { toast } from '@/components/ui/use-toast'

const menuItemFormSchema = z.object({
  recipes: z.array(z.object({
    recipeId: z.string(),
    date: z.string(),
    mealTime: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
    servings: z.number().min(1).optional(),
    note: z.string().optional(),
  })).min(1, '请至少选择一个菜品'),
})

type MenuItemFormValues = z.infer<typeof menuItemFormSchema>

interface AddMenuItemsProps {
  menuId: string
  token?: string
  isDialog?: boolean
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddMenuItems({
  menuId,
  token,
  isDialog,
  onSuccess,
  onCancel,
}: AddMenuItemsProps) {
  const { recipes, fetchRecipes } = useRecipeStore()
  
  // 选中的菜品
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([])
  // 搜索关键词
  const [searchQuery, setSearchQuery] = useState('')
  // 当前选择的分类
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  // 已有的菜品
  const [existingItems, setExistingItems] = useState<any[]>([])
  // 加载状态
  const [loading, setLoading] = useState(false)

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      recipes: [],
    },
  })

  useEffect(() => {
    fetchRecipes()
    // 获取已有菜品
    const fetchExistingItems = async () => {
      try {
        const items = await getMenuItems(menuId)
        setExistingItems(items)
      } catch (error) {
        // console.error('Failed to fetch existing items:', error)
      }
    }
    fetchExistingItems()
  }, [fetchRecipes, menuId])

  const toggleRecipeSelection = (recipeId: string) => {
    setSelectedRecipes(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    )
  }

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const onSubmit = async (values: MenuItemFormValues) => {
    try {
      setLoading(true)
      const date = form.getValues('recipes.0.date') || format(new Date(), 'yyyy-MM-dd')
      const mealTime = form.getValues('recipes.0.mealTime') || 'BREAKFAST'

      // 检查是否有重复的菜品
      const duplicates = selectedRecipes.filter(recipeId => 
        existingItems.some(item => 
          item.recipeId === recipeId && 
          item.date === date && 
          item.mealTime === mealTime
        )
      )

      if (duplicates.length > 0) {
        const duplicateNames = duplicates
          .map(id => recipes.find(r => r.id === id)?.name)
          .filter(Boolean)
          .join(', ')
        toast({
          title: '菜品重复',
          description: '已有以下菜品：' + duplicateNames,
          variant: 'destructive',
        })
        return
      }

      // 为每个选中的菜品创建菜单项
      for (const recipeId of selectedRecipes) {
        await createMenuItem({
          menuId,
          token,
          data: {
            recipeId,
            date,
            mealTime: mealTime as keyof typeof MealTime,
            servings: 1,
          }
        })
      }
      toast({
        title: '添加菜品成功',
      })
      onSuccess?.()
    } catch (error) {
      console.error('Failed to add menu items:', error)
      toast({
        title: '添加菜品失败',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <div className={isDialog ? "max-h-[80vh] overflow-y-auto" : ""}>
      <div className="grid gap-6 md:grid-cols-[1fr,300px]">
        {/* 左侧：菜品列表 */}
        <div className="space-y-6">
          {/* 搜索和筛选 */}
          <div className="flex gap-4">
            <Input
              placeholder="搜索菜品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="MEAT">荤菜</SelectItem>
                <SelectItem value="VEGETABLE">素菜</SelectItem>
                <SelectItem value="SOUP">汤类</SelectItem>
                <SelectItem value="STAPLE">主食</SelectItem>
                <SelectItem value="DESSERT">甜点</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 菜品网格 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedRecipes.includes(recipe.id) ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => toggleRecipeSelection(recipe.id)}
              >
                {recipe.coverImage && (
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <Image
                      src={recipe.coverImage}
                      alt={recipe.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{recipe.name}</CardTitle>
                    <Checkbox
                      checked={selectedRecipes.includes(recipe.id)}
                      onCheckedChange={() => toggleRecipeSelection(recipe.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{recipe.category}</Badge>
                    <Badge variant="secondary">
                      <Clock className="mr-1 h-3 w-3" />
                      {recipe.cookTime}分钟
                    </Badge>
                    <Badge variant="secondary">
                      <Users className="mr-1 h-3 w-3" />
                      {recipe.servings}人份
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {recipe.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 右侧：已选菜品和提交 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>已选菜品 ({selectedRecipes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {selectedRecipes.map((recipeId) => {
                    const recipe = recipes.find((r) => r.id === recipeId)
                    if (!recipe) return null
                    return (
                      <div
                        key={recipe.id}
                        className="flex items-center justify-between rounded-lg border p-2"
                      >
                        <span className="font-medium">{recipe.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRecipeSelection(recipe.id)}
                        >
                          移除
                        </Button>
                      </div>
                    )
                  })}
                </div>
                <ScrollBar />
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="recipes.0.date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>日期</FormLabel>
                          <DatePicker
                            date={field.value ? new Date(field.value) : new Date()}
                            onSelect={(date) =>
                              field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                            }
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="recipes.0.mealTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>用餐时间</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="选择用餐时间" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(MealTime).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={selectedRecipes.length === 0 || loading}
                    >
                      添加到菜单
                    </Button>
                    {isDialog && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                      >
                        取消
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )

  return isDialog ? (
    <Dialog>
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm">
        <div className="w-full max-w-6xl rounded-lg bg-background p-6 shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold">添加菜品</h2>
          {content}
        </div>
      </div>
    </Dialog>
  ) : content
}
