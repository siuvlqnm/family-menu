import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RecipeDetailCardProps {
  icon?: React.ReactNode
  title: string
  children: React.ReactNode
  className?: string
}

export function RecipeDetailCard({
  icon,
  title,
  children,
  className,
}: RecipeDetailCardProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          {icon && <span className="text-2xl mr-2">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
