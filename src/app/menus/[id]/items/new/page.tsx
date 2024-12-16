'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { useMenuStore } from '@/stores/menus-store'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingSpinner } from '@/components/ui/loading'
import { AddMenuItems } from '@/components/menus/add-menu-items'

export default function NewMenuItemPage() {
  const params = useParams() as { id: string }
  const searchParams = useSearchParams()
  const { id } = params
  const mealTime = searchParams.get('mealTime')
  const router = useRouter()
  const { checkAuth } = useAuthStore()
  const { menu, loading, error, fetchMenu } = useMenuStore()

  useEffect(() => {
    const isAuthed = checkAuth()
    if (!isAuthed) {
      router.replace('/login?from=/menus/' + id + '/items/new')
      return
    }
    fetchMenu(id)
  }, [checkAuth, fetchMenu, id, router])

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
      />

      <AddMenuItems
        menuId={menu.id}
        initialMealTime={mealTime as any}
        onSuccess={() => router.push(`/menus/${menu.id}`)}
      />
    </div>
  )
}
