import { MenuFilters, MenuType, MenuStatus } from '@/types/menus';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarIcon, Search, X } from 'lucide-react';

interface MenuFiltersProps {
  filters: MenuFilters;
  onFiltersChange: (filters: MenuFilters) => void;
  onReset: () => void;
}

const menuTypeLabels: Record<keyof typeof MenuType, string> = {
  DAILY: '日常',
  WEEKLY: '每周',
  HOLIDAY: '节日',
  SPECIAL: '特别',
  SHARE_RECORD: '分享记录',
};

const menuStatusLabels: Record<keyof typeof MenuStatus, string> = {
  DRAFT: '草稿',
  PUBLISHED: '已发布',
  ARCHIVED: '已归档',
};

export function MenuFilters({ filters, onFiltersChange, onReset }: MenuFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleTypeChange = (value: keyof typeof MenuType) => {
    onFiltersChange({ ...filters, type: value });
  };

  const handleStatusChange = (value: keyof typeof MenuStatus) => {
    onFiltersChange({ ...filters, status: value });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      startDate: date ? format(date, 'yyyy-MM-dd') : undefined,
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      endDate: date ? format(date, 'yyyy-MM-dd') : undefined,
    });
  };

  const handleSortChange = (value: 'latest' | 'popular') => {
    onFiltersChange({ ...filters, sort: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            placeholder="搜索菜单..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
            prefix={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
        <Select value={filters.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="菜单类型" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(menuTypeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(menuStatusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="排序" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">最新创建</SelectItem>
            <SelectItem value="popular">最受欢迎</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal',
                !filters.startDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.startDate ? (
                format(new Date(filters.startDate), 'PPP', { locale: zhCN })
              ) : (
                <span>开始日期</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.startDate ? new Date(filters.startDate) : undefined}
              onSelect={handleStartDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal',
                !filters.endDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.endDate ? (
                format(new Date(filters.endDate), 'PPP', { locale: zhCN })
              ) : (
                <span>结束日期</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.endDate ? new Date(filters.endDate) : undefined}
              onSelect={handleEndDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {Object.keys(filters).length > 0 && (
          <Button variant="ghost" onClick={onReset}>
            <X className="mr-2 h-4 w-4" />
            重置
          </Button>
        )}
      </div>
    </div>
  );
}
