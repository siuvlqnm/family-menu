'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface Tag {
  id: string
  name: string
}

interface TagInputProps {
  tags?: Tag[]
  selectedTags?: Tag[]
  onSelect?: (tag: Tag) => void
  onRemove?: (tag: Tag) => void
  disabled?: boolean
  className?: string
}

export function TagInput({
  tags = [],
  selectedTags = [],
  onSelect,
  onRemove,
  disabled,
  className,
}: TagInputProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const filteredTags = tags.filter(
    (tag) =>
      !selectedTags.find((selected) => selected.id === tag.id) &&
      tag.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (tag: Tag) => {
    onSelect?.(tag)
    setOpen(false)
  }

  const handleRemove = (e: React.MouseEvent, tag: Tag) => {
    e.preventDefault()
    onRemove?.(tag)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              'flex min-h-[40px] w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            {selectedTags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className={cn(
                  'gap-1 pr-0.5',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                <span>{tag.name}</span>
                {!disabled && onRemove && (
                  <button
                    type="button"
                    className="ml-1 rounded-full p-0.5 hover:bg-secondary-foreground/20"
                    onClick={(e) => handleRemove(e, tag)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">移除 {tag.name}</span>
                  </button>
                )}
              </Badge>
            ))}
            {!disabled && (
              <button
                type="button"
                className="inline-flex h-8 items-center text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(true)}
              >
                添加标签...
              </button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3">
              <input
                placeholder="搜索标签..."
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {filteredTags.length > 0 && (
              <CommandGroup>
                {filteredTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => handleSelect(tag)}
                  >
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
