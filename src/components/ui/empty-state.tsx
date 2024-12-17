import { cn } from "@/lib/utils"
import { Button } from "./button"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      {icon && <div className="h-10 w-10 text-muted-foreground">{icon}</div>}
      {title && <h3 className="mt-4 font-semibold">{title}</h3>}
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}
