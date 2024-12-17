'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useParams } from "next/navigation"
import { useEffect } from "react"
import { useRecipeStore } from "@/stores/recipes-store"
import { Clock, ChefHat, Star, Heart, Edit } from "lucide-react"
import { RecipeCategory, DifficultyLevel } from "@/types/recipes"
import { RecipeInfoCard } from "@/components/recipes/recipe-info-card"
import { RecipeIngredients } from "@/components/recipes/recipe-ingredients"
import { RecipeSteps } from "@/components/recipes/recipe-steps"
import { RecipeTags } from "@/components/recipes/recipe-tags"
import { RecipeDetailCard } from "@/components/recipes/recipe-detail-card"

export const runtime = 'edge';

const RecipeDetailPage = () => {
  const params = useParams() as { id: string }
  const { id } = params
  const { toast } = useToast()
  const router = useRouter()
  const { recipe, loading, error, fetchRecipe, toggleFavorite } = useRecipeStore()

  useEffect(() => {
    fetchRecipe(id)
  }, [id, fetchRecipe])

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await toggleFavorite(id)
      toast({
        title: recipe?.favorites ? "已取消收藏" : "已收藏",
        description: recipe?.favorites ? "该食谱已从收藏夹中移除" : "该食谱已添加到收藏夹",
      })
    } catch (error) {
      toast({
        title: "操作失败",
        description: error instanceof Error ? error.message : "收藏操作失败，请重试",
        variant: "destructive",
      })
    }
  }

  const getDifficultyColor = (difficulty: keyof typeof DifficultyLevel) => {
    switch (difficulty) {
      case "EASY":
        return "text-green-600"
      case "MEDIUM":
        return "text-yellow-600"
      case "HARD":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getDifficultyText = (difficulty: keyof typeof DifficultyLevel) => {
    switch (difficulty) {
      case "EASY":
        return "简单"
      case "MEDIUM":
        return "中等"
      case "HARD":
        return "困难"
      default:
        return "未知"
    }
  }

  const getCategoryText = (category: keyof typeof RecipeCategory) => {
    switch (category) {
      case "MEAT":
        return "荤菜"
      case "VEGETABLE":
        return "素菜"
      case "SOUP":
        return "汤羹"
      case "STAPLE":
        return "主食"
      case "SNACK":
        return "小吃"
      default:
        return "未知"
    }
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    toast({
      title: "获取食谱失败",
      description: error,
      variant: "destructive",
    })
    return null
  }

  if (!recipe) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold">食谱未找到</h2>
          <p className="text-muted-foreground mt-2">该食谱可能已被删除或移动</p>
          <Button
            className="mt-4"
            onClick={() => router.push('/recipes')}
          >
            返回食谱列表
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        {/* 标题卡片 */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-4xl">{recipe.name}</CardTitle>
                <p className="text-muted-foreground mt-2 text-lg">{recipe.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavorite}
                  className="hover:bg-pink-50 hover:text-pink-500"
                >
                  <Heart className={`h-5 w-5 ${recipe.favorites > 0 ? "fill-pink-500 text-pink-500" : ""}`} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push(`/recipes/${id}/edit`)}
                >
                  <Edit className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RecipeTags tags={recipe.tags || []} className="mt-2" />
          </CardContent>
        </Card>

        {/* 基本信息卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <RecipeInfoCard
            icon={<Clock className="h-6 w-6 text-primary" />}
            label="准备时间"
            value={`${recipe.prepTime}分钟`}
          />
          <RecipeInfoCard
            icon={<Clock className="h-6 w-6 text-primary" />}
            label="烹饪时间"
            value={`${recipe.cookTime}分钟`}
          />
          <RecipeInfoCard
            icon={<ChefHat className={`h-6 w-6 ${getDifficultyColor(recipe.difficulty)}`} />}
            label="难度"
            value={getDifficultyText(recipe.difficulty)}
          />
          <RecipeInfoCard
            icon={<Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />}
            label="评分"
            value={Number(recipe.rating).toFixed(1)}
          />
          <RecipeInfoCard
            icon={<span className="text-2xl">🍽️</span>}
            label="份量"
            value={`${recipe.servings}人份`}
          />
          <RecipeInfoCard
            icon={<span className="text-2xl">📑</span>}
            label="分类"
            value={getCategoryText(recipe.category)}
          />
        </div>

        {/* 食材和步骤 */}
        <div className="grid md:grid-cols-2 gap-8">
          <RecipeDetailCard
            icon="🥘"
            title="食材"
          >
            <RecipeIngredients ingredients={recipe.ingredients} />
          </RecipeDetailCard>

          <RecipeDetailCard
            icon="📝"
            title="步骤"
          >
            <RecipeSteps steps={recipe.steps} />
          </RecipeDetailCard>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailPage