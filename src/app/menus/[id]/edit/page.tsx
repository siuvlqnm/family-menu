'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { useMenuStore } from '@/stores/menus-store'
import { MenuForm } from '@/components/menus/menu-form'
import { PageHeader } from '@/components/ui/page-header'
import { toast } from '@/components/ui/use-toast'

export default function EditMenuPage() {
  const params = useParams() as { id: string }
  const { id } = params

  const router = useRouter()
  const { checkAuth } = useAuthStore()
  const { menu, fetchMenu, updateMenu } = useMenuStore()

  useEffect(() => {
    // 检查认证状态
    const isAuthed = checkAuth()
    if (!isAuthed) {
      router.replace(`/login?from=/menus/${id}/edit`)
      return
    }

    // 获取菜单详情
    fetchMenu(id)
  }, [checkAuth, router, id, fetchMenu])

  if (!menu) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-6">
        <PageHeader
          title="编辑菜单"
          description="修改菜单内容"
        />
        <div className="mx-auto max-w-2xl">
          <MenuForm
            initialData={menu}
            onSubmit={async (values) => {
              try {
                const updatedMenu = await updateMenu(id, {
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
                  title: '更新成功',
                  description: '菜单已更新',
                })
                router.push(`/menus/${updatedMenu.id}`)
              } catch (error) {
                console.error('Failed to update menu:', error)
                toast({
                  title: '更新失败',
                  description: '请稍后重试',
                  variant: 'destructive',
                })
              }
            }}
            onCancel={() => router.push(`/menus/${id}`)}
          />
        </div>
      </div>
    </div>
  )
}
