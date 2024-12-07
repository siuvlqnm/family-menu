import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataTableErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
}

export function DataTableError({
  message = "加载数据时出错",
  className,
  ...props
}: DataTableErrorProps) {
  return (
    <div
      className={cn(
        "flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-destructive">
          {message}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          请稍后重试或联系管理员
        </p>
      </div>
    </div>
  )
}
