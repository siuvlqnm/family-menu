import { Ingredient } from "@/types/recipes"
import { cn } from "@/lib/utils"

interface RecipeIngredientsProps {
  ingredients: Ingredient[]
  className?: string
}

export function RecipeIngredients({
  ingredients,
  className,
}: RecipeIngredientsProps) {
  if (!ingredients?.length) {
    return (
      <div className="text-muted-foreground text-center py-4">
        暂无食材信息
      </div>
    )
  }

  return (
    <ul className={cn("space-y-3", className)}>
      {ingredients.map((ingredient, index) => (
        <li
          key={`${ingredient.name}-${index}`}
          className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 transition-colors"
        >
          <span className="font-medium">{ingredient.name}</span>
          <span className="text-muted-foreground">
            {ingredient.quantity} {ingredient.unit}
          </span>
        </li>
      ))}
    </ul>
  )
}
