'use client'

import { useAuthStore } from '@/stores/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useRecipeStore } from '@/stores/recipes-store'
import { PageHeader } from '@/components/ui/page-header'
import { RecipeCard } from '@/components/recipes/recipe-card'
import { RecipeFilters } from '@/components/recipes/recipe-filters'
import { EmptyState } from '@/components/ui/empty-state'
import { DataTableLoading } from '@/components/ui/data-table/loading'
import { DataTableError } from '@/components/ui/data-table/error'
import { Plus, UtensilsCrossed } from 'lucide-react'
import { RecipeFilters as RecipeFiltersType, Recipe } from '@/types/recipes'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DataList } from '@/components/ui/data-list'

export default function RecipesPage() {
  const { isAuthenticated, checkAuth } = useAuthStore()
  const router = useRouter()
  const { recipes, loading, error, filters, setFilters, fetchRecipes } = useRecipeStore()

  useEffect(() => {
    // 检查认证状态
    const isAuthed = checkAuth()
    if (!isAuthed) {
      router.replace('/login?from=/recipes')
      return
    }
    // 获取食谱列表
    fetchRecipes()
  }, [checkAuth, router, fetchRecipes])

  const filterData = (recipe: Recipe, filters: RecipeFiltersType): boolean => {
    if (filters.category && recipe.category !== filters.category) {
      return false
    }
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
      return false
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        recipe.name.toLowerCase().includes(searchLower) ||
        (recipe.description?.toLowerCase()?.includes(searchLower) ?? false)
      )
    }
    return true
  }

  const sortData = (a: Recipe, b: Recipe, filters: RecipeFiltersType) => {
    switch (filters.sort) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'popular':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'rating':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      default:
        return 0
    }
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container space-y-6 py-6">
      <PageHeader
        title="食谱库"
        actions={[
          {
            label: '新建食谱',
            icon: Plus,
            onClick: () => router.push('/recipes/new'),
          },
        ]}
      />
      <DataList
        data={recipes}
        loading={loading}
        error={error ? new Error(error) : null}
        filters={filters}
        onFiltersChange={setFilters}
        onFiltersReset={() => setFilters({})}
        filterComponent={
          <RecipeFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={() => setFilters({})}
          />
        }
        renderItem={(recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        )}
        emptyIcon={<UtensilsCrossed />}
        emptyTitle="暂无食谱"
        emptyDescription="开始创建您的第一个食谱吧！"
        filterData={filterData}
        sortData={sortData}
      />
    </div>
  )
}
