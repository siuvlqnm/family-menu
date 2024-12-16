import { Recipe } from './recipes'

export const MenuType = {
  DAILY: '日常',
  WEEKLY: '每周',
  HOLIDAY: '节日',
  SPECIAL: '特别',
  SHARE_RECORD: '分享记录', // 新增分享记录类型
} as const

export const MenuStatus = {
  DRAFT: '草稿',
  PUBLISHED: '已发布',
  ARCHIVED: '已归档',
} as const

export const MealTime = {
  BREAKFAST: '早餐',
  LUNCH: '午餐',
  DINNER: '晚餐',
  SNACK: '点心',
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
  familyGroupId?: string
  familyGroupName?: string
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
  shareType: 'LINK' | 'TOKEN'
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
  mealTime?: keyof typeof MealTime
  familyGroupId?: string
  menuType?: 'personal' | 'family'
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
  familyGroupId?: string
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
  familyGroupId?: string
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
