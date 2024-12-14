'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/auth-store'
import { useMenuStore } from '@/stores/menus-store'
import { useRecipeStore } from '@/stores/recipes-store'
import { MealTime } from '@/types/menus'
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
import { RecipeCombobox } from '@/components/recipes/recipe-combobox'

const menuItemFormSchema = z.object({
  recipeId: z.string().min(1, '请选择菜品'),
  date: z.string(),
  mealTime: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  servings: z.number().min(1).optional(),
  note: z.string().optional(),
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

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      date: searchParams.get('date') || format(new Date(), 'yyyy-MM-dd'),
      mealTime: (searchParams.get('mealTime') as keyof typeof MealTime) || 'BREAKFAST',
      servings: 1,
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

  const onSubmit = async (values: MenuItemFormValues) => {
    try {
      await createMenuItem(id, values)
      router.push(`/menus/${id}`)
    } catch (error) {
      console.error('Failed to add menu item:', error)
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
        // backButton
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="recipeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>选择菜品</FormLabel>
                <FormControl>
                  <RecipeCombobox
                    recipes={recipes}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>日期</FormLabel>
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
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
              name="mealTime"
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
                        <SelectItem key={value} value={value}>
                          {key === 'BREAKFAST'
                            ? '早餐'
                            : key === 'LUNCH'
                            ? '午餐'
                            : key === 'DINNER'
                            ? '晚餐'
                            : '点心'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="servings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>份数</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="输入份数"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>备注</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="输入备注信息"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              取消
            </Button>
            <Button type="submit">添加</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
