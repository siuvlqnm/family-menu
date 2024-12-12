'use client'

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useParams } from "next/navigation"
import { useEffect } from "react"
import { useRecipeStore } from "@/stores/recipes-store"
import { Clock, ChefHat, Star, Heart, Edit } from "lucide-react"
import { RecipeCategory, DifficultyLevel } from "@/types/recipes"

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
    await toggleFavorite(id)
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
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{recipe.name}</h1>
            <p className="text-muted-foreground mt-2">{recipe.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
            >
              <Heart className={`h-5 w-5 ${recipe.favorites > 0 ? "fill-red-500 text-red-500" : ""}`} />
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

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1.5 h-4 w-4" />
            <span>准备时间：{recipe.prepTime}分钟</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1.5 h-4 w-4" />
            <span>烹饪时间：{recipe.cookTime}分钟</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <ChefHat className={`mr-1.5 h-4 w-4 ${getDifficultyColor(recipe.difficulty)}`} />
            <span>难度：{getDifficultyText(recipe.difficulty)}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="mr-1.5 h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>评分：{Number(recipe.rating).toFixed(1)}</span>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">食材</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{ingredient.name}</span>
                  <span className="text-muted-foreground">{ingredient.amount} {ingredient.unit}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">步骤</h2>
            <ol className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p>{step.description}</p>
                    {step.duration && (
                      <p className="text-sm text-muted-foreground mt-1">预计时间：{step.duration}分钟</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {recipe.tags && recipe.tags.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">标签</h2>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-sm font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailPage