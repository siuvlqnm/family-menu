'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/auth-store'
import { useMenuStore } from '@/stores/menus-store'
import { MenuType } from '@/types/menus'
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
import { format } from 'date-fns'

const menuFormSchema = z.object({
  name: z.string().min(1, '请输入菜单名称'),
  description: z.string().optional(),
  type: z.enum(['daily', 'weekly', 'holiday', 'special']),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  startDate: z.string(),
  endDate: z.string(),
})

type MenuFormValues = z.infer<typeof menuFormSchema>

export default function NewMenuPage() {
  const router = useRouter()
  const { checkAuth } = useAuthStore()
  const { createMenu } = useMenuStore()

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'daily',
      tags: [],
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
    },
  })

  useEffect(() => {
    const isAuthed = checkAuth()
    if (!isAuthed) {
      router.replace('/login?from=/menus/new')
    }
  }, [checkAuth, router])

  const onSubmit = async (values: MenuFormValues) => {
    try {
      await createMenu(values)
      router.push('/menus')
    } catch (error) {
      console.error('Failed to create menu:', error)
    }
  }

  return (
    <div className="container space-y-6 py-6">
      <PageHeader
        title="新建菜单"
        description="创建一个新的菜单"
        backButton
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

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              取消
            </Button>
            <Button type="submit">创建</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
