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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RecipeDetailCard } from '@/components/recipes/recipe-detail-card'
import Image from 'next/image'
import { Clock, Users, Utensils, ChefHat, ListOrdered } from 'lucide-react'
import { createMenuItem, getMenuItems, deleteMenuItem } from '@/services/menus'
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
  initialMealTime?: keyof typeof MealTime
}

export function AddMenuItems({
  menuId,
  token,
  isDialog,
  onSuccess,
  onCancel,
  initialMealTime,
}: AddMenuItemsProps) {
  const { recipes, fetchRecipes } = useRecipeStore()
  
  // 选中的菜品
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([])
  // 当前查看详情的菜品
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null)
  // 搜索关键词
  const [searchQuery, setSearchQuery] = useState('')
  // 当前选择的分类
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  // 已有的菜品
  const [existingItems, setExistingItems] = useState<any[]>([])
  // 加载状态
  const [loading, setLoading] = useState(false)
  // 已选择的日期和用餐时间
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [selectedMealTime, setSelectedMealTime] = useState<keyof typeof MealTime>(
    initialMealTime || 'BREAKFAST'
  )

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      recipes: [{
        date: format(new Date(), 'yyyy-MM-dd'),
        mealTime: initialMealTime || 'BREAKFAST',
        recipeId: '',
        servings: 1,
      }],
    },
  })

  // 获取已有菜品
  const fetchExistingItems = async () => {
    try {
      setLoading(true)
      const items = await getMenuItems(menuId)
      console.log('Fetched items:', items)
      setExistingItems(items)

      if (items.length > 0) {
        // 如果有初始用餐时间，使用最新日期和初始用餐时间
        if (initialMealTime) {
          const latestDate = items.reduce((latest, item) => {
            return item.date > latest ? item.date : latest
          }, items[0].date)
          
          setSelectedDate(latestDate)
          setSelectedMealTime(initialMealTime)
          
          // 更新表单值
          form.setValue('recipes.0.date', latestDate)
          form.setValue('recipes.0.mealTime', initialMealTime)
        } else {
          // 否则使用最新的菜品项
          const latestItem = items[items.length - 1]
          setSelectedDate(latestItem.date)
          setSelectedMealTime(latestItem.mealTime)
          
          // 更新表单值
          form.setValue('recipes.0.date', latestItem.date)
          form.setValue('recipes.0.mealTime', latestItem.mealTime)
        }
      }
    } catch (error) {
      console.error('Error fetching items:', error)
      toast({
        title: '获取菜品失败',
        description: '无法加载已有菜品',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes()
    fetchExistingItems()
  }, [fetchRecipes, menuId])

  // 当选择的菜品、日期或用餐时间变化时，更新表单值
  useEffect(() => {
    const recipes = selectedRecipes.map(recipeId => ({
      recipeId,
      date: selectedDate,
      mealTime: selectedMealTime,
      servings: 1,
    }))
    form.setValue('recipes', recipes)
  }, [selectedRecipes, selectedDate, selectedMealTime])

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

      // 检查是否有重复的菜品
      const duplicates = selectedRecipes.filter(recipeId => 
        existingItems.some(item => 
          item.recipeId === recipeId && 
          item.date === selectedDate && 
          item.mealTime === selectedMealTime
        )
      )

      if (duplicates.length > 0) {
        const duplicateNames = duplicates
          .map(id => recipes.find(r => r.id === id)?.name)
          .filter(Boolean)
          .join(', ')
        toast({
          title: '菜品重复',
          description: `${selectedDate} ${MealTime[selectedMealTime]}已有以下菜品：${duplicateNames}`,
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
            date: selectedDate,
            mealTime: selectedMealTime,
            servings: 1,
          }
        })
      }
      toast({
        title: '添加菜品成功',
        description: `成功添加${selectedRecipes.length}个菜品`,
      })
      onSuccess?.()
    } catch (error) {
      console.error('Failed to add menu items:', error)
      toast({
        title: '添加菜品失败',
        description: '请稍后重试',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // 删除已有菜品
  const handleDeleteMenuItem = async (itemId: string) => {
    try {
      setLoading(true)
      await deleteMenuItem(menuId, itemId)
      await fetchExistingItems() // 重新加载菜品列表
      toast({
        title: '删除菜品成功',
      })
    } catch (error) {
      console.error('Failed to delete menu item:', error)
      toast({
        title: '删除菜品失败',
        description: '请稍后重试',
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
              >
                {/* {recipe.coverImage && (
                  <div 
                    className="relative aspect-video overflow-hidden rounded-t-lg"
                    onClick={() => setViewingRecipe(recipe)}
                  >
                    <Image
                      src={recipe.coverImage}
                      alt={recipe.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )} */}
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between">
                    <CardTitle 
                      className="text-lg cursor-pointer hover:text-primary"
                      onClick={() => setViewingRecipe(recipe)}
                    >
                      {recipe.name}
                    </CardTitle>
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
                <div className="space-y-4">
                  {/* 显示当前日期和用餐时间下已有的菜品 */}
                  {existingItems.filter(item => 
                    item.date === selectedDate && 
                    item.mealTime === selectedMealTime
                  ).length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        {selectedDate} {MealTime[selectedMealTime]} 已添加的菜品：
                      </div>
                      {existingItems
                        .filter(item => 
                          item.date === selectedDate && 
                          item.mealTime === selectedMealTime
                        )
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-lg border border-muted bg-muted/50 p-2"
                          >
                            <span className="font-medium">{item.recipe.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMenuItem(item.id)}
                              disabled={loading}
                            >
                              删除
                            </Button>
                          </div>
                        ))
                      }
                    </div>
                  )}
                  
                  {/* 显示新选择的菜品 */}
                  {selectedRecipes.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        新选择的菜品：
                      </div>
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
                  )}
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
                            date={selectedDate ? new Date(selectedDate) : new Date()}
                            onSelect={(date) => {
                              const formattedDate = date ? format(date, 'yyyy-MM-dd') : ''
                              setSelectedDate(formattedDate)
                              field.onChange(formattedDate)
                            }}
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
                            value={selectedMealTime}
                            onValueChange={(value: keyof typeof MealTime) => {
                              console.log('Selected meal time:', value); // 添加日志
                              setSelectedMealTime(value)
                              field.onChange(value)
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue>
                                  {MealTime[selectedMealTime]}
                                </SelectValue>
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

      {/* 菜品详情对话框 */}
      <Dialog open={!!viewingRecipe} onOpenChange={() => setViewingRecipe(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {viewingRecipe && (
            <>
              <DialogHeader>
                <DialogTitle>{viewingRecipe.name}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6">
                {/* {viewingRecipe.coverImage && (
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={viewingRecipe.coverImage}
                      alt={viewingRecipe.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )} */}
                <div className="flex flex-wrap gap-4">
                  <RecipeDetailCard
                    icon={<Clock className="h-5 w-5" />}
                    title="烹饪时间"
                    className="flex-1"
                  >
                    <p>{viewingRecipe.cookTime} 分钟</p>
                  </RecipeDetailCard>
                  <RecipeDetailCard
                    icon={<Users className="h-5 w-5" />}
                    title="食用人数"
                    className="flex-1"
                  >
                    <p>{viewingRecipe.servings} 人份</p>
                  </RecipeDetailCard>
                  <RecipeDetailCard
                    icon={<Utensils className="h-5 w-5" />}
                    title="分类"
                    className="flex-1"
                  >
                    <p>{viewingRecipe.category}</p>
                  </RecipeDetailCard>
                </div>
                {viewingRecipe.description && (
                  <RecipeDetailCard
                    icon={<ChefHat className="h-5 w-5" />}
                    title="描述"
                  >
                    <p className="whitespace-pre-wrap">{viewingRecipe.description}</p>
                  </RecipeDetailCard>
                )}
                {viewingRecipe.steps && viewingRecipe.steps.length > 0 && (
                  <RecipeDetailCard
                    icon={<ListOrdered className="h-5 w-5" />}
                    title="步骤"
                  >
                    <ol className="list-decimal list-inside space-y-2">
                      {viewingRecipe.steps.sort((a, b) => a.orderIndex - b.orderIndex).map((step, index) => (
                        <li key={index} className="space-y-1">
                          <span>{step.description}</span>
                          {step.duration && (
                            <span className="ml-2 text-sm text-muted-foreground">
                              预计时间：{step.duration}分钟
                            </span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </RecipeDetailCard>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
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
