'use client'

import { useAuthStore } from '@/stores/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useMenuStore } from '@/stores/menus-store'
import { PageHeader } from '@/components/ui/page-header'
import { MenuCard } from '@/components/menus/menu-card'
import { MenuFilters } from '@/components/menus/menu-filters'
import { DataList } from '@/components/ui/data-list'
import { Plus, UtensilsCrossed } from 'lucide-react'
import { MenuFilters as MenuFiltersType } from '@/types/menus'

export default function MenusPage() {
  const { isAuthenticated, checkAuth, user } = useAuthStore()
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

  const filterData = (menu: any, filters: MenuFiltersType) => {
    // 首先根据菜单类型过滤
    if (filters.menuType === 'personal' && menu.familyGroupId) {
      return false
    }
    if (filters.menuType === 'family' && !menu.familyGroupId) {
      return false
    }
    
    // 如果选择了特定的家庭组，只显示该家庭组的菜单
    if (filters.familyGroupId && menu.familyGroupId !== filters.familyGroupId) {
      return false
    }

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
        menu.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        (menu.familyGroupName || '').toLowerCase().includes(searchLower)
      )
    }
    return true
  }

  const sortData = (a: any, b: any, filters: MenuFiltersType) => {
    switch (filters.sort) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'popular':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      default:
        return 0
    }
  }

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
      <DataList
        data={menus}
        loading={loading}
        error={error}
        filters={filters}
        onFiltersChange={setFilters}
        onFiltersReset={resetFilters}
        filterComponent={
          <MenuFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
          />
        }
        renderItem={(menu) => (
          <MenuCard key={menu.id} menu={menu} />
        )}
        emptyIcon={UtensilsCrossed}
        emptyTitle="暂无菜单"
        emptyDescription="开始创建您的第一个菜单吧！"
        filterData={filterData}
        sortData={sortData}
      />
    </div>
  )
}
