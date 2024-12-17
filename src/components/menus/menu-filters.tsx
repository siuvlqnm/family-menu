'use client'

import { MenuFilters as MenuFiltersType } from '@/types/menus'
import { MenuType, MenuStatus, MealTime } from '@/types/menus'
import { FilterPanel, FilterOption } from '@/components/ui/filter-panel'

interface MenuFiltersProps {
  filters: MenuFiltersType
  onFiltersChange: (filters: MenuFiltersType) => void
  onReset: () => void
  className?: string
}

export function MenuFilters({
  filters,
  onFiltersChange,
  onReset,
  className,
}: MenuFiltersProps) {
  const filterOptions: FilterOption[] = [
    {
      type: 'select',
      label: '菜单归属',
      field: 'menuType',
      placeholder: '选择菜单类型',
      options: [
        { value: 'personal', label: '个人菜单' },
        { value: 'family', label: '家庭组菜单' },
      ],
    },
    {
      type: 'select',
      label: '类型',
      field: 'type',
      placeholder: '选择菜单类型',
      options: Object.entries(MenuType).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      type: 'select',
      label: '状态',
      field: 'status',
      placeholder: '选择菜单状态',
      options: Object.entries(MenuStatus).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      type: 'select',
      label: '用餐时间',
      field: 'mealTime',
      placeholder: '选择用餐时间',
      options: Object.entries(MealTime).map(([value, label]) => ({
        value,
        label,
      })),
    },
    {
      type: 'date',
      label: '开始日期',
      field: 'startDate',
      placeholder: '选择开始日期',
    },
    {
      type: 'date',
      label: '结束日期',
      field: 'endDate',
      placeholder: '选择结束日期',
    },
    {
      type: 'tags',
      label: '标签',
      field: 'tags',
      placeholder: '输入标签',
    },
    {
      type: 'search',
      label: '搜索',
      field: 'search',
      placeholder: '搜索菜单名称、描述等',
      className: 'sm:w-72',
    },
  ]

  return (
    <FilterPanel
      filters={filters}
      options={filterOptions}
      onFiltersChange={onFiltersChange}
      onReset={onReset}
      className={className}
    />
  )
}
