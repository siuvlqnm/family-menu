import { Recipe } from './recipes'

export const MenuType = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  HOLIDAY: 'holiday',
  SPECIAL: 'special',
  SHARE_RECORD: 'shareRecord', // 新增分享记录类型
} as const

export const MenuStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

export const MealTime = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
} as const

export interface Menu {
  id: string
  name: string
  description?: string
  type: keyof typeof MenuType
  coverImage?: string
  tags: string[]
  startDate: string
  endDate: string
  status: keyof typeof MenuStatus
  familyGroupId: string
  createdBy: string
  createdAt: string
  updatedAt: string
  userId: string // 新增用户ID字段
}

export interface MenuItem {
  id: string
  menuId: string
  recipeId: string
  date: string
  mealTime: keyof typeof MealTime
  servings?: number
  orderIndex: number
  note?: string
  createdAt: string
  updatedAt: string
  recipe: Pick<Recipe, 'id' | 'name' | 'description' | 'category' | 'difficulty'>
}

export interface MenuWithItems extends Menu {
  items: MenuItem[]
}

export interface MenuShare {
  id: string
  menuId: string
  userId: string // 新增用户ID字段
  shareType: 'link' | 'token'
  token?: string
  expiresAt?: string
  allowEdit: boolean // 新增允许编辑字段
  createdAt: string
  updatedAt: string
}

// 菜单过滤器
export interface MenuFilters {
  type?: keyof typeof MenuType
  status?: keyof typeof MenuStatus
  startDate?: string
  endDate?: string
  tags?: string[]
  search?: string
  sort?: 'latest' | 'popular'
  mealTime?: keyof typeof MealTime // 新增餐时过滤器
}

// 创建菜单的输入
export interface CreateMenuInput {
  name: string
  description?: string
  type?: keyof typeof MenuType
  coverImage?: string
  tags?: string[]
  startDate: string
  endDate: string
  familyGroupId: string
  userId: string // 新增用户ID字段
}

// 更新菜单的输入
export interface UpdateMenuInput {
  name?: string
  description?: string
  type?: keyof typeof MenuType
  coverImage?: string
  tags?: string[]
  startDate?: string
  endDate?: string
  status?: keyof typeof MenuStatus
}

// 添加菜单项的输入
export interface AddMenuItemInput {
  recipeId: string
  date: string
  mealTime: keyof typeof MealTime
  servings?: number
  orderIndex?: number
  note?: string
}

// 更新菜单项的输入
export interface UpdateMenuItemInput {
  servings?: number
  orderIndex?: number
  note?: string
}

// 创建菜单分享的输入
export interface CreateMenuShareInput {
  shareType: 'link' | 'token'
  expiresAt?: string
  allowEdit: boolean // 新增允许编辑字段
}
