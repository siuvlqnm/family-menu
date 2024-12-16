'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, addDays } from 'date-fns'
import { useAuthStore } from '@/stores/auth-store'
import { useMenuStore } from '@/stores/menus-store'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MenuSharesList } from '@/components/menus/menu-shares-list'
import { Copy, Link2 } from 'lucide-react'

const shareFormSchema = z.object({
  shareType: z.enum(['LINK', 'TOKEN']),
  expiresAt: z.string().optional(),
  allowEdit: z.boolean(),
})

type ShareFormValues = z.infer<typeof shareFormSchema>

export default function ShareMenuPage() {
  const params = useParams() as { id: string }
  const { id } = params

  const router = useRouter()
  const { checkAuth } = useAuthStore()
  const {
    menu,
    menuShares,
    loading,
    error,
    fetchMenu,
    fetchMenuShares,
    createMenuShare,
    deleteMenuShare,
  } = useMenuStore()
  const [shareUrl, setShareUrl] = useState<string>('')

  const form = useForm<ShareFormValues>({
    resolver: zodResolver(shareFormSchema),
    defaultValues: {
      shareType: 'LINK',
      expiresAt: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      allowEdit: true,
    },
  })

  useEffect(() => {
    const isAuthed = checkAuth()
    if (!isAuthed) {
      router.replace('/login?from=/menus/' + id + '/share')
      return
    }
    fetchMenu(id)
    fetchMenuShares(id)
  }, [checkAuth, fetchMenu, fetchMenuShares, id, router])

  const onSubmit = async (values: ShareFormValues) => {
    try {
      const share = await createMenuShare(id, values)
      const baseUrl = window.location.origin
      const shareUrl = share.shareType === 'LINK'
        ? `${baseUrl}/shared/menus/${share.id}`
        : `${baseUrl}/shared/menus/${share.id}?token=${share.token}`
      setShareUrl(shareUrl)
      toast({
        title: '分享链接已生成',
        description: '您可以复制链接分享给他人',
      })
      // 刷新分享列表
      fetchMenuShares(id)
    } catch (error) {
      console.error('Failed to create share:', error)
      toast({
        title: '创建分享失败',
        description: '请稍后重试',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteShare = async (shareId: string) => {
    try {
      await deleteMenuShare(id, shareId)
      toast({
        title: '删除成功',
        description: '分享已删除',
      })
      // 刷新分享列表
      fetchMenuShares(id)
    } catch (error) {
      console.error('Failed to delete share:', error)
      toast({
        title: '删除失败',
        description: '请稍后重试',
        variant: 'destructive',
      })
    }
  }

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: '链接已复制',
        description: '您可以将链接分享给他人',
      })
    } catch (error) {
      console.error('Failed to copy:', error)
      toast({
        title: '复制失败',
        description: '请手动复制链接',
        variant: 'destructive',
      })
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
        title="分享菜单"
        description={`分享菜单"${menu.name}"`}
        // backButton
      />

      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create">创建分享</TabsTrigger>
          <TabsTrigger value="manage">管理分享</TabsTrigger>
        </TabsList>
        <TabsContent value="create" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="shareType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>分享方式</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择分享方式" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LINK">公开链接</SelectItem>
                            <SelectItem value="TOKEN">访问令牌</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiresAt"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>过期时间</FormLabel>
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
                    name="allowEdit"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">允许编辑</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            访问者可以修改菜品
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    <Link2 className="mr-2 h-4 w-4" />
                    生成分享链接
                  </Button>
                </form>
              </Form>

              {shareUrl && (
                <div className="space-y-2">
                  <Label htmlFor="share-url">分享链接</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="share-url"
                      value={shareUrl}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={copyShareUrl}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="mb-4 text-lg font-medium">分享说明</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <strong>公开链接：</strong>
                  任何拥有链接的人都可以访问您的菜单。适合分享给多人或在社交媒体上分享。
                </p>
                <p>
                  <strong>访问令牌：</strong>
                  需要输入令牌才能访问菜单。适合分享给特定人员或需要更高安全性的场景。
                </p>
                <p>
                  <strong>过期时间：</strong>
                  超过设定时间后，分享链接将失效。不设置则永久有效。
                </p>
                <p>
                  <strong>编辑权限：</strong>
                  如果允许编辑，访问者可以修改菜品信息。您可以随时关闭此权限。
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="manage" className="space-y-6">
          <MenuSharesList
            shares={menuShares || []}
            onDelete={handleDeleteShare}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
