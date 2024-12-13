'use client'

import { useAuthStore } from '@/stores/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useMenuStore } from '@/stores/menus-store'
import { PageHeader } from '@/components/ui/page-header'
import { MenuCard } from '@/components/menus/menu-card'
import { MenuFilters } from '@/components/menus/menu-filters'
import { EmptyState } from '@/components/ui/empty-state'
import { DataTableLoading } from '@/components/ui/data-table/loading'
import { DataTableError } from '@/components/ui/data-table/error'
import { Plus, UtensilsCrossed } from 'lucide-react'
import { MenuFilters as MenuFiltersType } from '@/types/menus'

export default function MenusPage() {
  const { isAuthenticated, checkAuth } = useAuthStore()
  const router = useRouter()
  const { menus, loading, error, filters, setFilters, resetFilters, fetchMenus } = useMenuStore()

  useEffect(() => {
    // 检查认证状态
    const isAuthed = checkAuth()
    if (!isAuthed) {
      router.replace('/login?from=/menus')
      return
    }
    // 获取菜单列表
    fetchMenus()
  }, [checkAuth, router, fetchMenus])

  const handleFiltersChange = (newFilters: MenuFiltersType) => {
    setFilters(newFilters)
  }

  const handleFiltersReset = () => {
    resetFilters()
  }

  const filteredMenus = menus.filter((menu) => {
    if (filters.type && menu.type !== filters.type) {
      return false
    }
    if (filters.status && menu.status !== filters.status) {
      return false
    }
    if (filters.startDate && new Date(menu.startDate) < new Date(filters.startDate)) {
      return false
    }
    if (filters.endDate && new Date(menu.endDate) > new Date(filters.endDate)) {
      return false
    }
    if (filters.tags?.length && !filters.tags.every((tag) => menu.tags.includes(tag))) {
      return false
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        menu.name.toLowerCase().includes(searchLower) ||
        (menu.description || '').toLowerCase().includes(searchLower) ||
        menu.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      )
    }
    return true
  })

  const sortedMenus = [...filteredMenus].sort((a, b) => {
    switch (filters.sort) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'popular':
        // TODO: 根据实际需求实现排序逻辑
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="container space-y-6 py-6">
        <PageHeader
          title="菜单管理"
          description="管理您的菜单计划"
          actions={[
            {
              label: '新建菜单',
              icon: Plus,
              onClick: () => router.push('/menus/new'),
            },
          ]}
        />
        <MenuFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleFiltersReset}
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
          description="管理您的菜单计划"
          actions={[
            {
              label: '新建菜单',
              icon: Plus,
              onClick: () => router.push('/menus/new'),
            },
          ]}
        />
        <MenuFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleFiltersReset}
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
          description="管理您的菜单计划"
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
      <MenuFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleFiltersReset}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedMenus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} />
        ))}
      </div>
    </div>
  )
}
