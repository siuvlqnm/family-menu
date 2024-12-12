import { cn } from "@/lib/utils"

interface RecipeTagsProps {
  tags: string[]
  className?: string
}

export function RecipeTags({
  tags,
  className,
}: RecipeTagsProps) {
  if (!tags?.length) {
    return null
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="px-2.5 py-1 text-sm bg-secondary/50 text-secondary-foreground rounded-full"
        >
          #{tag}
        </span>
      ))}
    </div>
  )
}
