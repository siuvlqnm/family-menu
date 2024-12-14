import { MenuFilters as MenuFiltersType } from '@/types/menus'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/ui/date-picker'
import { TagInput } from '@/components/ui/tag-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MenuType, MenuStatus, MealTime } from '@/types/menus'
// import { useFamilyStore } from '@/stores/family-store'
import { cn } from '@/lib/utils'

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
  // const { familyGroups } = useFamilyStore()

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap gap-4">
        {/* 菜单类型选择 */}
        <div className="w-full sm:w-auto">
          <Label>菜单归属</Label>
          <Select
            value={filters.menuType || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                menuType: value === 'all' ? undefined : (value as 'personal' | 'family'),
                familyGroupId: value === 'personal' ? undefined : filters.familyGroupId,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="选择菜单类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部菜单</SelectItem>
              <SelectItem value="personal">个人菜单</SelectItem>
              <SelectItem value="family">家庭组菜单</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 家庭组选择（仅当选择家庭组菜单时显示） */}
        {/* {filters.menuType === 'family' && (
          <div className="w-full sm:w-auto">
            <Label>家庭组</Label>
            <Select
              value={filters.familyGroupId || 'all'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  familyGroupId: value === 'all' ? undefined : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择家庭组" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有家庭组</SelectItem>
                {familyGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )} */}

        {/* 菜单类型过滤器 */}
        <div className="w-full sm:w-auto">
          <Label>类型</Label>
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                type: value === 'all' ? undefined : value as keyof typeof MenuType,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="选择菜单类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有类型</SelectItem>
              {Object.entries(MenuType).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 状态过滤器 */}
        <div className="w-full sm:w-auto">
          <Label>状态</Label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                status: value === 'all' ? undefined : value as keyof typeof MenuStatus,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有状态</SelectItem>
              {Object.entries(MenuStatus).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 日期范围过滤器 */}
        <div className="flex w-full flex-wrap gap-4 sm:w-auto">
          <div>
            <Label>开始日期</Label>
            <DatePicker
              value={filters.startDate ? new Date(filters.startDate) : undefined}
              onChange={(date) =>
                onFiltersChange({
                  ...filters,
                  startDate: date?.toISOString(),
                })
              }
            />
          </div>
          <div>
            <Label>结束日期</Label>
            <DatePicker
              value={filters.endDate ? new Date(filters.endDate) : undefined}
              onChange={(date) =>
                onFiltersChange({
                  ...filters,
                  endDate: date?.toISOString(),
                })
              }
            />
          </div>
        </div>

        {/* 标签过滤器 */}
        <div className="w-full sm:w-72">
          <Label>标签</Label>
          <TagInput
            value={filters.tags || []}
            onChange={(tags) =>
              onFiltersChange({
                ...filters,
                tags: tags.length ? tags : undefined,
              })
            }
            suggestions={[]}  // TODO: 从后端获取标签建议
            placeholder="输入标签"
          />
        </div>

        {/* 搜索框 */}
        <div className="w-full sm:w-72">
          <Label>搜索</Label>
          <Input
            value={filters.search || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                search: e.target.value || undefined,
              })
            }
            placeholder="搜索菜单名称、描述或标签"
          />
        </div>

        {/* 排序选择 */}
        <div className="w-full sm:w-auto">
          <Label>排序</Label>
          <Select
            value={filters.sort || 'latest'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                sort: value as 'latest' | 'popular',
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="选择排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">最新创建</SelectItem>
              <SelectItem value="popular">最近更新</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 重置按钮 */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={onReset}>
          重置筛选
        </Button>
      </div>
    </div>
  )
}
