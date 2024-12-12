import { RecipeFilters } from "@/types/recipes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface RecipeFiltersProps {
  filters: RecipeFilters
  onFiltersChange: (filters: RecipeFilters) => void
  onReset: () => void
}

export function RecipeFilters({
  filters,
  onFiltersChange,
  onReset,
}: RecipeFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value })
  }

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ ...filters, category: value === 'all' ? '' : value })
  }

  const handleDifficultyChange = (value: string) => {
    onFiltersChange({
      ...filters,
      difficulty: value === 'all' ? '' : (value as RecipeFilters["difficulty"]),
    })
  }

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sort: value === 'default' ? undefined : (value as RecipeFilters["sort"]),
    })
  }

  const hasActiveFilters =
    filters.category ||
    filters.difficulty ||
    filters.search ||
    filters.sort

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            搜索
          </Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="搜索食谱..."
              value={filters.search || ""}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
        </div>
        <div className="w-[150px]">
          <Label htmlFor="category" className="sr-only">
            分类
          </Label>
          <Select
            value={filters.category || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              <SelectItem value="MEAT">荤菜</SelectItem>
              <SelectItem value="VEGETABLE">素菜</SelectItem>
              <SelectItem value="SOUP">汤类</SelectItem>
              <SelectItem value="STAPLE">主食</SelectItem>
              <SelectItem value="SNACK">小吃</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[150px]">
          <Label htmlFor="difficulty" className="sr-only">
            难度
          </Label>
          <Select
            value={filters.difficulty || "all"}
            onValueChange={handleDifficultyChange}
          >
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="选择难度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部难度</SelectItem>
              <SelectItem value="EASY">简单</SelectItem>
              <SelectItem value="MEDIUM">中等</SelectItem>
              <SelectItem value="HARD">困难</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[150px]">
          <Label htmlFor="sort" className="sr-only">
            排序
          </Label>
          <Select
            value={filters.sort || "default"}
            onValueChange={handleSortChange}
          >
            <SelectTrigger id="sort">
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">默认排序</SelectItem>
              <SelectItem value="latest">最新</SelectItem>
              <SelectItem value="popular">最受欢迎</SelectItem>
              <SelectItem value="rating">评分最高</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
