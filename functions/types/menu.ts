import { z } from 'zod';

// 时段
export const MealTime = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
} as const;

// 菜单状态
export const MenuStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

// 创建菜单验证 schema
export const createMenuSchema = z.object({
  name: z.string().min(2).max(100),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  familyGroupId: z.string(),
});

// 更新菜单验证 schema
export const updateMenuSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.enum(Object.values(MenuStatus)).optional(),
});

// 添加菜单项验证 schema
export const addMenuItemSchema = z.object({
  recipeId: z.string(),
  date: z.coerce.date(),
  mealTime: z.enum(Object.values(MealTime)),
  note: z.string().max(500).optional(),
});

// 更新菜单项验证 schema
export const updateMenuItemSchema = z.object({
  note: z.string().max(500).optional(),
});

// 菜单查询验证 schema
export const menuQuerySchema = z.object({
  familyGroupId: z.string(),
  status: z.enum(Object.values(MenuStatus)).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// 类型定义
export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;
export type AddMenuItemInput = z.infer<typeof addMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
export type MenuQueryInput = z.infer<typeof menuQuerySchema>;

export interface Menu {
  id: string;
  name: string;
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
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  recipe: {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
  };
}

export interface MenuWithItems extends Menu {
  items: MenuItem[];
}
