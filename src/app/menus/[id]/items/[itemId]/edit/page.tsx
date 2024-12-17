'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
import { Trash } from 'lucide-react'

export const runtime = 'edge';

const menuItemFormSchema = z.object({
  recipeId: z.string().min(1, '请选择菜品'),
  date: z.string(),
  mealTime: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  servings: z.number().min(1).optional(),
  note: z.string().optional(),
})

type MenuItemFormValues = z.infer<typeof menuItemFormSchema>

export default function EditMenuItemPage() {
  const params = useParams() as { id: string, itemId: string }
  const { id, itemId } = params

  const router = useRouter()
  const { checkAuth } = useAuthStore()
  const { menu, menuItem, loading, error, fetchMenu, fetchMenuItem, updateMenuItem, deleteMenuItem } =
    useMenuStore()
  const { recipes, fetchRecipes } = useRecipeStore()

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      servings: 1,
    },
  })

  useEffect(() => {
    const isAuthed = checkAuth()
    if (!isAuthed) {
      router.replace(
        '/login?from=/menus/' + id + '/items/' + itemId + '/edit'
      )
      return
    }
    fetchMenu(id)
    fetchMenuItem(id, itemId)
    fetchRecipes()
  }, [checkAuth, fetchMenu, fetchMenuItem, fetchRecipes, id, itemId, router])

  useEffect(() => {
    if (menuItem) {
      form.reset({
        recipeId: menuItem.recipeId,
        date: menuItem.date,
        mealTime: menuItem.mealTime,
        servings: menuItem.servings,
        note: menuItem.note,
      })
    }
  }, [form, menuItem])

  const onSubmit = async (values: MenuItemFormValues) => {
    try {
      await updateMenuItem(id, itemId, values)
      router.push(`/menus/${id}`)
    } catch (error) {
      console.error('Failed to update menu item:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMenuItem(id, itemId)
      router.push(`/menus/${id}`)
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

  if (!menu || !menuItem) {
    return (
      <div className="container py-6">
        <div className="rounded-lg bg-muted p-4">
          菜单或菜品不存在
        </div>
      </div>
    )
  }

  return (
    <div className="container space-y-6 py-6">
      <PageHeader
        title="编辑菜品"
        description={`编辑菜单"${menu.name}"中的菜品`}
        // backButton
        actions={[
          {
            label: '删除',
            icon: Trash,
            variant: 'secondary',
            render: (props) => (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" {...props}>
                    <Trash className="mr-2 h-4 w-4" />
                    删除
                  </Button>
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
                    <AlertDialogAction onClick={handleDelete}>
                      删除
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ),
          },
        ]}
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
            <Button type="submit">保存</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
