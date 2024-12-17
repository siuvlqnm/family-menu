import { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title?: string
  description?: string
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {icon && <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">{icon}</div>}
        {title && <h3 className="mt-4 text-lg font-semibold">{title}</h3>}
        {description && <p className="mb-4 mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}
