'use client'

import { useAuthStore } from '@/stores/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useMenuStore } from '@/stores/menu-store'
import { PageHeader } from '@/components/ui/page-header'
import { MenuCard } from '@/components/menus/menu-card'
import { EmptyState } from '@/components/ui/empty-state'
import { DataTableLoading } from '@/components/ui/data-table/loading'
import { DataTableError } from '@/components/ui/data-table/error'
import { Plus, UtensilsCrossed } from 'lucide-react'

export default function MenusPage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const { menus, loading, error, fetchMenus } = useMenuStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    fetchMenus()
  }, [fetchMenus])

  if (loading) {
    return (
      <div className="container space-y-6 py-6">
        <PageHeader
          title="菜单管理"
          actions={[
            {
              label: '新建菜单',
              icon: Plus,
              onClick: () => router.push('/menus/new'),
            },
          ]}
        />
        <DataTableLoading columnCount={3} rowCount={3} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container space-y-6 py-6">
        <PageHeader
          title="菜单管理"
          actions={[
            {
              label: '新建菜单',
              icon: Plus,
              onClick: () => router.push('/menus/new'),
            },
          ]}
        />
        <DataTableError message={error} />
      </div>
    )
  }

  if (!menus.length) {
    return (
      <div className="container space-y-6 py-6">
        <PageHeader
          title="菜单管理"
          actions={[
            {
              label: '新建菜单',
              icon: Plus,
              onClick: () => router.push('/menus/new'),
            },
          ]}
        />
        <EmptyState
          icon={UtensilsCrossed}
          title="暂无菜单"
          description="创建一个新的菜单，开始规划您的美食之旅"
          action={{
            label: '新建菜单',
            onClick: () => router.push('/menus/new'),
          }}
        />
      </div>
    )
  }

  return (
    <div className="container space-y-6 py-6">
      <PageHeader
        title="菜单管理"
        description={`共 ${menus.length} 个菜单`}
        actions={[
          {
            label: '新建菜单',
            icon: Plus,
            onClick: () => router.push('/menus/new'),
          },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} />
        ))}
      </div>
    </div>
  )
}
