import { Recipe } from "@/types/recipes"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Clock, Heart, ChefHat, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRecipeStore } from "@/stores/recipes-store"

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const router = useRouter()
  const { toggleFavorite } = useRecipeStore()

  const getDifficultyColor = (difficulty: Recipe["difficulty"]) => {
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

  const getDifficultyText = (difficulty: Recipe["difficulty"]) => {
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

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await toggleFavorite(recipe.id)
  }

  return (
    <Card className="group cursor-pointer transition-all hover:shadow-md" onClick={() => router.push(`/recipes/${recipe.id}`)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="line-clamp-1 text-lg">{recipe.name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {recipe.description}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleFavorite}
          >
            <Heart
              className={`h-5 w-5 ${
                recipe.favorites > 0 ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1.5 h-4 w-4" />
            <span>{recipe.prepTime + recipe.cookTime}分钟</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <ChefHat className={`mr-1.5 h-4 w-4 ${getDifficultyColor(recipe.difficulty)}`} />
            <span>{getDifficultyText(recipe.difficulty)}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{recipe.rating.toFixed(1)}</span>
          </div>
          <Button variant="outline" size="sm">
            查看详情
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
