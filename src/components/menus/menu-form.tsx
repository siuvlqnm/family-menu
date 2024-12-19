'use client'

import { Menu, MenuType, MenuStatus } from '@/types/menus'
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

const menuFormSchema = z.object({
  name: z.string().min(1, '请输入菜单名称'),
  description: z.string().optional(),
  type: z.enum(['DAILY', 'WEEKLY', 'HOLIDAY', 'SPECIAL']),
  startDate: z.string().min(1, '请选择开始日期'),
  endDate: z.string().min(1, '请选择结束日期'),
  // coverImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  menuType: z.enum(['personal', 'family']),
  familyGroupId: z.string(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
}).refine((data) => {
  if (data.menuType === 'family') {
    return data.familyGroupId != null && data.familyGroupId.length > 0;
  }
  return true;
}, {
  message: '请选择家庭组',
  path: ['familyGroupId'],
}).refine((data) => {
  const start = new Date(data.startDate)
  const end = new Date(data.endDate)
  return start <= end
}, {
  message: '结束日期必须晚于或等于开始日期',
  path: ['endDate'],
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
  const defaultValues: MenuFormValues = initialData
    ? {
        ...initialData,
        startDate: format(new Date(initialData.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(initialData.endDate), 'yyyy-MM-dd'),
        menuType: initialData.familyGroupId ? 'family' : 'personal',
        tags: initialData.tags || [],
        status: initialData.status || 'DRAFT',
      }
    : {
        name: '',
        description: '',
        type: 'DAILY',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        tags: [],
        menuType: 'personal',
        // coverImage: '',
        status: 'DRAFT',
        familyGroupId: '',
      }

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues,
    mode: 'all',
  })

  const handleSubmit = async (values: MenuFormValues) => {
    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Form submission failed:', error)
    }
  }

  console.log('Form State:', {
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    errors: form.formState.errors,
    values: form.getValues(),
  })

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
                    value={field.value || ''}
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
                      <SelectValue placeholder="选择菜单类型" />
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
                        date ? format(date, 'yyyy-MM-dd') : ''
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
                        date ? format(date, 'yyyy-MM-dd') : ''
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
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>标签</FormLabel>
                <FormControl>
                  <TagInput
                    placeholder="输入标签，按回车添加"
                    tags={field.value}
                    onTagsChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  添加标签以便于分类和搜索，例如：家常菜、减脂餐、节日餐等
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
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
                <FormDescription>
                  上传一张能代表这个菜单的图片
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}

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
                      <SelectValue placeholder="选择菜单归属" />
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

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              取消
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '保存中...' : '保存'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
