import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
}

export function LoadingSpinner({
  size = 24,
  className,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      <Loader2 className="h-[1.2em] w-[1.2em] animate-spin text-muted-foreground" />
      <span className="sr-only">加载中...</span>
    </div>
  )
}

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
}

export function Loading({ text = '加载中...', className, ...props }: LoadingProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex min-h-[400px] flex-col items-center justify-center space-y-4',
        className
      )}
      {...props}
    >
      <LoadingSpinner size={32} />
      <div className="text-sm text-muted-foreground">{text}</div>
    </div>
  )
}
