'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/auth-store'
import { useMenuStore } from '@/stores/menus-store'
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
import { PageHeader } from '@/components/ui/page-header'
import { LoadingSpinner } from '@/components/ui/loading'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import { Clock, Users } from 'lucide-react'

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

export default function NewMenuItemPage() {
  const params = useParams() as { id: string }
  const { id } = params
  const router = useRouter()
  const searchParams = useSearchParams()
  const { checkAuth } = useAuthStore()
  const { menu, loading, error, fetchMenu, createMenuItem } = useMenuStore()
  const { recipes, fetchRecipes } = useRecipeStore()
  
  // 选中的菜品
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([])
  // 搜索关键词
  const [searchQuery, setSearchQuery] = useState('')
  // 当前选择的分类
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      recipes: [],
    },
  })

  useEffect(() => {
    const isAuthed = checkAuth()
    if (!isAuthed) {
      router.replace('/login?from=/menus/' + id + '/items/new')
      return
    }
    fetchMenu(id)
    fetchRecipes()
  }, [checkAuth, fetchMenu, fetchRecipes, id, router])

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
      // 为每个选中的菜品创建菜单项
      for (const recipeId of selectedRecipes) {
        await createMenuItem(id, {
          recipeId,
          date: searchParams.get('date') || format(new Date(), 'yyyy-MM-dd'),
          mealTime: (searchParams.get('mealTime') as keyof typeof MealTime) || 'BREAKFAST',
          servings: 1,
        })
      }
      router.push(`/menus/${id}`)
    } catch (error) {
      console.error('Failed to add menu items:', error)
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

  return (
    <div className="container space-y-6 py-6">
      <PageHeader
        title="添加菜品"
        description={`添加菜品到菜单"${menu.name}"`}
      />

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
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={selectedRecipes.length === 0}
                  >
                    添加到菜单
                  </Button>
                </form>
              </Form>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
