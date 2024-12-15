'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface TagInputProps {
  tags?: string[]
  onTagsChange?: (tags: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TagInput({
  tags = [],
  onTagsChange,
  placeholder = "输入标签后按回车添加...",
  disabled,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      const newTag = inputValue.trim()
      if (!tags.includes(newTag)) {
        onTagsChange?.([...tags, newTag])
      }
      setInputValue('')
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // 当输入框为空时，按退格键删除最后一个标签
      onTagsChange?.(tags.slice(0, -1))
    }
  }

  const handleRemove = (tagToRemove: string) => {
    onTagsChange?.(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div
      className={cn(
        'flex min-h-[40px] w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className={cn(
            'gap-1 pr-0.5',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <span>{tag}</span>
          {!disabled && onTagsChange && (
            <button
              type="button"
              className="ml-1 rounded-full p-0.5 hover:bg-secondary-foreground/20"
              onClick={() => handleRemove(tag)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">移除 {tag}</span>
            </button>
          )}
        </Badge>
      ))}
      {!disabled && (
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 !m-0 !p-0 !h-8 min-w-[120px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder={tags.length === 0 ? placeholder : ""}
        />
      )}
    </div>
  )
}
