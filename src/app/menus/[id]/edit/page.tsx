'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/auth-store'
import { useMenuStore } from '@/stores/menus-store'
import { MenuType, MenuStatus } from '@/types/menus'
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
import { TagInput } from '@/components/ui/tag-input'
import { ImageUpload } from '@/components/ui/image-upload'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingSpinner } from '@/components/ui/loading'
import { format } from 'date-fns'

const menuFormSchema = z.object({
  name: z.string().min(1, '请输入菜单名称'),
  description: z.string().optional(),
  type: z.enum(['daily', 'weekly', 'holiday', 'special']),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(['draft', 'published', 'archived']),
})

type MenuFormValues = z.infer<typeof menuFormSchema>

export default function EditMenuPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { checkAuth } = useAuthStore()
  const { menu, loading, error, fetchMenu, updateMenu } = useMenuStore()

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'daily',
      tags: [],
      status: 'draft',
    },
  })

  useEffect(() => {
    const isAuthed = checkAuth()
    if (!isAuthed) {
      router.replace('/login?from=/menus/' + params.id + '/edit')
      return
    }
    fetchMenu(params.id)
  }, [checkAuth, fetchMenu, params.id, router])

  useEffect(() => {
    if (menu) {
      form.reset({
        name: menu.name,
        description: menu.description,
        type: menu.type,
        coverImage: menu.coverImage,
        tags: menu.tags,
        startDate: menu.startDate,
        endDate: menu.endDate,
        status: menu.status,
      })
    }
  }, [form, menu])

  const onSubmit = async (values: MenuFormValues) => {
    try {
      await updateMenu(params.id, values)
      router.push('/menus')
    } catch (error) {
      console.error('Failed to update menu:', error)
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

  return (
    <div className="container space-y-6 py-6">
      <PageHeader
        title="编辑菜单"
        description="修改菜单信息"
        // backButton
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>菜单名称</FormLabel>
                <FormControl>
                  <Input placeholder="输入菜单名称" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>描述</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="输入菜单描述"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>类型</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择菜单类型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(MenuType).map(([key, value]) => (
                      <SelectItem key={value} value={value}>
                        {key === 'DAILY'
                          ? '日常'
                          : key === 'WEEKLY'
                          ? '每周'
                          : key === 'HOLIDAY'
                          ? '节日'
                          : '特别'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>封面图片</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>标签</FormLabel>
                <FormControl>
                  <TagInput
                    placeholder="输入标签后按回车"
                    tags={field.value || []}
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
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>开始日期</FormLabel>
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
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>结束日期</FormLabel>
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
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>状态</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择菜单状态" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(MenuStatus).map(([key, value]) => (
                      <SelectItem key={value} value={value}>
                        {key === 'DRAFT'
                          ? '草稿'
                          : key === 'PUBLISHED'
                          ? '已发布'
                          : '已归档'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
