'use client'

import { ReactNode } from 'react'
import { Label } from './label'
import { Input } from './input'
import { Button } from './button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'
import { DatePicker } from './date-picker'
import { TagInput } from './tag-input'
import { cn } from '@/lib/utils'

export interface FilterOption {
  type: 'select' | 'date' | 'tags' | 'search'
  label: string
  field: string
  value?: any
  options?: Array<{
    value: string
    label: string
  }>
  placeholder?: string
  className?: string
}

interface FilterPanelProps {
  filters: Record<string, any>
  options: FilterOption[]
  onFiltersChange: (filters: Record<string, any>) => void
  onReset: () => void
  className?: string
  children?: ReactNode
}

export function FilterPanel({
  filters,
  options,
  onFiltersChange,
  onReset,
  className,
  children,
}: FilterPanelProps) {
  const handleFilterChange = (field: string, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value === 'all' ? undefined : value,
    })
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <div key={option.field} className={cn('w-full sm:w-auto', option.className)}>
            <Label>{option.label}</Label>
            {option.type === 'select' && (
              <Select
                value={filters[option.field] || 'all'}
                onValueChange={(value) => handleFilterChange(option.field, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={option.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {option.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {option.type === 'date' && (
              <DatePicker
                date={filters[option.field] ? new Date(filters[option.field]) : undefined}
                onSelect={(date) =>
                  handleFilterChange(
                    option.field,
                    date ? date.toISOString() : undefined
                  )
                }
              />
            )}
            {option.type === 'tags' && (
              <TagInput
                tags={filters[option.field] || []}
                onTagsChange={(tags) => handleFilterChange(option.field, tags)}
                placeholder={option.placeholder}
              />
            )}
            {option.type === 'search' && (
              <Input
                value={filters[option.field] || ''}
                onChange={(e) => handleFilterChange(option.field, e.target.value)}
                placeholder={option.placeholder}
              />
            )}
          </div>
        ))}
      </div>

      {children}

      <div className="flex justify-end">
        <Button variant="outline" onClick={onReset}>
          重置筛选
        </Button>
      </div>
    </div>
  )
}
