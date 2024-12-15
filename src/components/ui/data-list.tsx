'use client'

import { ReactNode } from 'react'
import { DataTableLoading } from './data-table/loading'
import { DataTableError } from './data-table/error'
import { EmptyState } from './empty-state'

export interface DataListProps<T, F> {
  data: T[]
  loading?: boolean
  error?: Error | null
  filters: F
  onFiltersChange: (filters: F) => void
  onFiltersReset: () => void
  filterComponent: ReactNode
  renderItem: (item: T) => ReactNode
  emptyIcon?: ReactNode
  emptyTitle?: string
  emptyDescription?: string
  filterData: (item: T, filters: F) => boolean
  sortData: (a: T, b: T, filters: F) => number
}

export function DataList<T, F>({
  data,
  loading,
  error,
  filters,
  onFiltersChange,
  onFiltersReset,
  filterComponent,
  renderItem,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  filterData,
  sortData,
}: DataListProps<T, F>) {
  if (loading) {
    return <DataTableLoading columnCount={3} rowCount={3} />
  }

  if (error) {
    return <DataTableError message={error.message} />
  }

  const filteredData = data.filter((item) => filterData(item, filters))
  const sortedData = [...filteredData].sort((a, b) => sortData(a, b, filters))

  if (sortedData.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
      />
    )
  }

  return (
    <div className="space-y-6">
      {filterComponent}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedData.map(renderItem)}
      </div>
    </div>
  )
}
