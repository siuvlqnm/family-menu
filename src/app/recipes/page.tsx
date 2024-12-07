'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useRecipeStore } from '@/stores/recipe-store'
import { PageHeader } from '@/components/ui/page-header'
import { RecipeCard } from '@/components/recipes/recipe-card'
import { RecipeFilters } from '@/components/recipes/recipe-filters'
import { EmptyState } from '@/components/ui/empty-state'
import { DataTableLoading } from '@/components/ui/data-table/loading'
import { DataTableError } from '@/components/ui/data-table/error'
import { Plus, UtensilsCrossed } from 'lucide-react'
import { RecipeFilters as RecipeFiltersType } from '@/types/recipe'
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RecipesPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { recipes, loading, error, filters, setFilters, fetchRecipes } = useRecipeStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  const handleFiltersChange = (newFilters: RecipeFiltersType) => {
    setFilters(newFilters)
  }

  const handleFiltersReset = () => {
    setFilters({})
  }

  const filteredRecipes = recipes.filter((recipe) => {
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
        recipe.description.toLowerCase().includes(searchLower) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      )
    }
    return true
  })

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (filters.sort) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'popular':
        return b.favorites - a.favorites
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  if (loading) {
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
        <RecipeFilters
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
          title="食谱库"
          actions={[
            {
              label: '新建食谱',
              icon: Plus,
              onClick: () => router.push('/recipes/new'),
            },
          ]}
        />
        <RecipeFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleFiltersReset}
        />
        <DataTableError message={error} />
      </div>
    )
  }

  if (!recipes.length) {
    return (
      <div className="container space-y-6 py-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">食谱</h1>
            <p className="text-muted-foreground">管理你的食谱集合</p>
          </div>
          <Button asChild>
            <Link href="/recipes/new">
              <Plus className="mr-2 h-4 w-4" />
              新建食谱
            </Link>
          </Button>
        </div>
        <EmptyState
          icon={UtensilsCrossed}
          title="暂无食谱"
          description="创建一个新的食谱，开始记录您的烹饪心得"
          action={{
            label: '新建食谱',
            onClick: () => router.push('/recipes/new'),
          }}
        />
      </div>
    )
  }

  return (
    <div className="container space-y-6 py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">食谱</h1>
          <p className="text-muted-foreground">管理你的食谱集合</p>
        </div>
        <Button asChild>
          <Link href="/recipes/new">
            <Plus className="mr-2 h-4 w-4" />
            新建食谱
          </Link>
        </Button>
      </div>
      <RecipeFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleFiltersReset}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}
