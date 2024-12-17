'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { useMenuStore } from '@/stores/menus-store'
import { MenuForm } from '@/components/menus/menu-form'
import { PageHeader } from '@/components/ui/page-header'
import { toast } from '@/components/ui/use-toast'
import { useEffect } from 'react'

export default function NewMenuPage() {
  const router = useRouter()
  const { checkAuth } = useAuthStore()
  const { createMenu } = useMenuStore()

  useEffect(() => {
    const isAuthed = checkAuth()
    if (!isAuthed) {
      router.replace('/login?from=/menus/new')
      return
    }
  }, [checkAuth, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-6">
        <PageHeader
          title="新建菜单"
          description="创建一个新的菜单，记录和分享你的美食计划"
        />
        <div className="mx-auto max-w-2xl">
          <MenuForm
            onSubmit={async (values) => {
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
            }}
            onCancel={() => router.push('/menus')}
          />
        </div>
      </div>
    </div>
  )
}