'use client'

import { Menu, MenuType } from '@/types/menus'
import { format } from 'date-fns'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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

const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
})

const menuFormSchema = z.object({
  name: z.string().min(1, '请输入菜单名称'),
  description: z.string().optional(),
  type: z.enum(['DAILY', 'WEEKLY', 'HOLIDAY', 'SPECIAL']),
  startDate: z.string(),
  endDate: z.string(),
  coverImage: z.string().optional(),
  tags: z.array(tagSchema),
  menuType: z.enum(['personal', 'family']),
  familyGroupId: z.string().optional(),
})

type MenuFormValues = z.infer<typeof menuFormSchema>

interface MenuFormProps {
  initialData?: Menu
  onSubmit: (data: MenuFormValues) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
}

export function MenuForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: MenuFormProps) {
  const defaultValues = initialData
    ? {
        ...initialData,
        startDate: format(new Date(initialData.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(initialData.endDate), 'yyyy-MM-dd'),
        menuType: initialData.familyGroupId ? 'family' : 'personal',
        tags: initialData.tags || [],
      }
    : {
        name: '',
        description: '',
        type: 'DAILY' as const,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        tags: [],
        menuType: 'personal' as const,
      }

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues,
  })

  const handleSubmit = async (values: MenuFormValues) => {
    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Form submission failed:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
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
                    placeholder="描述这个菜单的特点和亮点"
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
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(MenuType).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
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
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>开始日期</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(
                        date ? date.toISOString().split('T')[0] : ''
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>结束日期</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(
                        date ? date.toISOString().split('T')[0] : ''
                      )
                    }
                  />
                </FormControl>
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
                  />
                </FormControl>
                <FormDescription>上传一张美食图片作为菜单封面</FormDescription>
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
                    selectedTags={field.value || []}
                    onSelect={(tag) => {
                      field.onChange([...(field.value || []), tag])
                    }}
                    onRemove={(tag) => {
                      field.onChange(
                        (field.value || []).filter((t) => t.id !== tag.id)
                      )
                    }}
                  />
                </FormControl>
                <FormDescription>输入标签后按回车添加，按退格键删除最后一个标签</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="menuType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>菜单归属</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="personal">个人菜单</SelectItem>
                    <SelectItem value="family">家庭组菜单</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '保存中...' : initialData ? '保存修改' : '创建菜单'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
