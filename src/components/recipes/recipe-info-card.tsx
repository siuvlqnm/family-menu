import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface RecipeInfoCardProps {
  icon: ReactNode
  label: string
  value: string | number
  className?: string
}

export function RecipeInfoCard({
  icon,
  label,
  value,
  className,
}: RecipeInfoCardProps) {
  return (
    <div className={cn(
      "bg-card p-4 rounded-lg border shadow-sm flex flex-col items-center justify-center text-center",
      className
    )}>
      <div className="mb-2">
        {icon}
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
