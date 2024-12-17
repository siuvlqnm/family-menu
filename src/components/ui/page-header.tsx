import { cn } from "@/lib/utils"
import { Button } from "./button"
import { LucideIcon } from "lucide-react"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  actions?: {
    label: string
    icon?: LucideIcon
    onClick?: () => void
    variant?: "default" | "secondary" | "outline" | "ghost"
    render?: (props: any) => React.ReactNode
  }[]
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
        className
      )}
      {...props}
    >
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => {
            if (action.render) {
              return action.render({
                key: index,
                variant: action.variant,
                onClick: action.onClick,
              })
            }

            const Icon = action.icon
            return (
              <Button
                key={index}
                variant={action.variant}
                onClick={action.onClick}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {action.label}
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}
