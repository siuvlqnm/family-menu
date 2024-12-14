'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/auth-store'
import { useMenuStore } from '@/stores/menus-store'
import { useFamilyStore } from '@/stores/family-store'
import { Button } from '@/components/ui/button'
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
import { toast } from '@/components/ui/use-toast'
import { MenuType, MenuStatus } from '@/types/menus'

const formSchema = z.object({
  name: z.string().min(1, '请输入菜单名称'),
  description: z.string().optional(),
  type: z.enum(['DAILY', 'WEEKLY', 'HOLIDAY', 'SPECIAL']),
  startDate: z.string(),
  endDate: z.string(),
  coverImage: z.string().optional(),
  tags: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  menuType: z.enum(['personal', 'family']),
  familyGroupId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function NewMenuPage() {
  const router = useRouter()
  const { checkAuth } = useAuthStore()
  const { familyGroups, fetchFamilyGroups } = useFamilyStore()
  const { createMenu } = useMenuStore()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'DAILY',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      tags: [],
      menuType: 'personal',
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      const menu = await createMenu({
        name: values.name,
        description: values.description,
        type: values.type,
        coverImage: values.coverImage,
        tags: values.tags,
        startDate: values.startDate,
        endDate: values.endDate,
        familyGroupId: values.menuType === 'family' ? values.familyGroupId : undefined,
      })
      toast({
        title: '创建成功',
        description: '菜单已创建',
      })
      router.push(`/menus/${menu.id}`)
    } catch (error) {
      console.error('Failed to create menu:', error)
      toast({
        title: '创建失败',
        description: '请稍后重试',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-6">
        <PageHeader
          title="新建菜单"
          description="创建一个新的菜单，记录和分享你的美食计划"
        />

        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="menuType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>菜单归属</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择菜单归属" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="personal">个人菜单</SelectItem>
                              <SelectItem value="family">家庭组菜单</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          选择菜单归属
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('menuType') === 'family' && (
                    <FormField
                      control={form.control}
                      name="familyGroupId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>选择家庭组</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="选择家庭组" />
                              </SelectTrigger>
                              <SelectContent>
                                {familyGroups.map((group) => (
                                  <SelectItem key={group.id} value={group.id}>
                                    {group.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            选择家庭组
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

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
                        <FormDescription>
                          上传一张美食图片作为菜单封面
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>菜单名称</FormLabel>
                        <FormControl>
                          <Input placeholder="输入菜单名称" {...field} />
                        </FormControl>
                        <FormDescription>
                          为你的菜单起一个有趣的名字
                        </FormDescription>
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
                            placeholder="描述一下这个菜单..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          添加一些描述，让大家更好地了解这个菜单
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
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
                                <SelectItem key={key} value={key}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            选择一个合适的类型来分类你的菜单
                          </FormDescription>
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
                              tags={[
                                { id: '1', name: '家常菜' },
                                { id: '2', name: '川菜' },
                                { id: '3', name: '粤菜' },
                                { id: '4', name: '减脂' },
                                { id: '5', name: '快手菜' },
                              ]}
                              selectedTags={field.value || []}
                              onSelect={(tag) =>
                                field.onChange([...(field.value || []), tag])
                              }
                              onRemove={(tag) =>
                                field.onChange(
                                  field.value?.filter((t) => t.id !== tag.id)
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            添加一些标签来更好地分类和查找
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
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
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    取消
                  </Button>
                  <Button type="submit">创建菜单</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
