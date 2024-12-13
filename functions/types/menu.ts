import { z } from 'zod';

// 时段
export const MealTime = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
} as const;

// 菜单类型
export const MenuType = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  HOLIDAY: 'holiday',
  SPECIAL: 'special',
} as const;

// 菜单状态
export const MenuStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

// 菜单分享类型
export const MenuShareType = {
  LINK: 'link',    // 链接分享
  TOKEN: 'token',  // 一次性访问令牌
} as const;

// 创建菜单验证 schema
export const createMenuSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(Object.values(MenuType)).optional(),
  coverImage: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  familyGroupId: z.string(),
});

// 更新菜单验证 schema
export const updateMenuSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  type: z.enum(Object.values(MenuType)).optional(),
  coverImage: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.enum(Object.values(MenuStatus)).optional(),
});

// 添加菜单项验证 schema
export const addMenuItemSchema = z.object({
  recipeId: z.string(),
  date: z.coerce.date(),
  mealTime: z.enum(Object.values(MealTime)),
  servings: z.number().int().positive().optional(),
  orderIndex: z.number().int().min(0).optional(),
  note: z.string().max(500).optional(),
});

// 更新菜单项验证 schema
export const updateMenuItemSchema = z.object({
  servings: z.number().int().positive().optional(),
  orderIndex: z.number().int().min(0).optional(),
  note: z.string().max(500).optional(),
});

// 菜单查询验证 schema
export const menuQuerySchema = z.object({
  familyGroupId: z.string(),
  type: z.enum(Object.values(MenuType)).optional(),
  status: z.enum(Object.values(MenuStatus)).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// 创建菜单分享验证 schema
export const createMenuShareSchema = z.object({
  shareType: z.enum(Object.values(MenuShareType)),
  expiresAt: z.coerce.date().optional(),  // 分享过期时间，可选
});

// 类型定义
export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;
export type AddMenuItemInput = z.infer<typeof addMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
export type MenuQueryInput = z.infer<typeof menuQuerySchema>;
export type CreateMenuShareInput = z.infer<typeof createMenuShareSchema>;

export interface Menu {
  id: string;
  name: string;
  description?: string;
  type: typeof MenuType[keyof typeof MenuType];
  coverImage?: string;
  tags: string[];
  startDate: Date;
  endDate: Date;
  status: typeof MenuStatus[keyof typeof MenuStatus];
  familyGroupId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  menuId: string;
  recipeId: string;
  date: Date;
  mealTime: typeof MealTime[keyof typeof MealTime];
  servings?: number;
  orderIndex: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  recipe: {
    id: string;
    name: string;
    description: string;
    category: string;
    difficulty: string;
  };
}

export interface MenuWithItems extends Menu {
  items: MenuItem[];
}

// 菜单分享接口
export interface MenuShare {
  id: string;
  menuId: string;
  shareType: typeof MenuShareType[keyof typeof MenuShareType];
  token?: string;  // 一次性访问令牌
  expiresAt?: Date;
  createdAt: Date;
  createdBy: string;
}
