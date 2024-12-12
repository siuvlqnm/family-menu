import { Step } from "@/types/recipes"
import { cn } from "@/lib/utils"

interface RecipeStepsProps {
  steps: Step[]
  className?: string
}

export function RecipeSteps({
  steps,
  className,
}: RecipeStepsProps) {
  if (!steps?.length) {
    return (
      <div className="text-muted-foreground text-center py-4">
        暂无步骤信息
      </div>
    )
  }

  return (
    <ol className={cn("space-y-4", className)}>
      {steps.map((step, index) => (
        <li key={`step-${index}`} className="flex gap-4">
          <div className="flex-none w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
            {index + 1}
          </div>
          <div className="flex-1 pt-1">
            <p className="text-secondary-foreground">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
