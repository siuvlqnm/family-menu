'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Recipe } from '@/types/recipes'

interface RecipeComboboxProps {
  recipes: Recipe[]
  value?: string
  onChange: (value: string) => void
}

export function RecipeCombobox({ recipes, value, onChange }: RecipeComboboxProps) {
  const [open, setOpen] = useState(false)

  const selectedRecipe = recipes.find((recipe) => recipe.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedRecipe ? selectedRecipe.name : '选择菜品...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="搜索菜品..." />
          <CommandEmpty>未找到相关菜品</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {recipes.map((recipe) => (
              <CommandItem
                key={recipe.id}
                value={recipe.name}
                onSelect={() => {
                  onChange(recipe.id)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === recipe.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <div className="flex flex-col">
                  <span>{recipe.name}</span>
                  {recipe.description && (
                    <span className="text-sm text-muted-foreground">
                      {recipe.description}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
