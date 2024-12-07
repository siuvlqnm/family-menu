import { cn } from "@/lib/utils"

interface DataTableLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  columnCount: number
  rowCount?: number
}

export function DataTableLoading({
  columnCount,
  rowCount = 5,
  className,
  ...props
}: DataTableLoadingProps) {
  return (
    <div
      className={cn("w-full space-y-4 overflow-hidden", className)}
      {...props}
    >
      <div className="flex items-center gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-24 animate-pulse rounded-md bg-muted"
          />
        ))}
      </div>
      <div className="rounded-lg border">
        <div className="border-b">
          <div className="grid h-12 grid-cols-[repeat(auto-fit,minmax(0,1fr))] items-center gap-4 px-4">
            {Array.from({ length: columnCount }).map((_, i) => (
              <div
                key={i}
                className="h-4 w-full animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        </div>
        <div>
          {Array.from({ length: rowCount }).map((_, i) => (
            <div
              key={i}
              className="grid h-16 grid-cols-[repeat(auto-fit,minmax(0,1fr))] items-center gap-4 border-b px-4 last:border-0"
            >
              {Array.from({ length: columnCount }).map((_, j) => (
                <div
                  key={j}
                  className="h-4 w-full animate-pulse rounded-md bg-muted"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
