import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { MeasurementUnit } from '../types/recipe';

// 定义食材接口
export interface Ingredient {
  name: string;
  amount: number;
  quantity: number;
  unit: keyof typeof MeasurementUnit;
  orderIndex: number;
}

export interface Step {
  orderIndex: number;
  description: string;
}

// 用户表
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  userName: text('user_name').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// 家庭组表
export const familyGroups = sqliteTable('family_groups', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  inviteCode: text('invite_code').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// 家庭组成员表
export const familyMembers = sqliteTable('family_members', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  familyGroupId: text('family_group_id')
    .notNull()
    .references(() => familyGroups.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['admin', 'member'] }).notNull(),
  joinedAt: integer('joined_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// 食谱表
export const recipes = sqliteTable('recipes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category', {
    enum: ['MEAT', 'VEGETABLE', 'SOUP', 'STAPLE', 'SNACK'],
  }).notNull(),
  difficulty: text('difficulty', {
    enum: ['EASY', 'MEDIUM', 'HARD'],
  }).notNull(),
  prepTime: integer('prep_time'),
  cookTime: integer('cook_time'),
  servings: integer('servings'),
  createdBy: text('created_by')
    .notNull()
    .references(() => users.id),
  familyGroupId: text('family_group_id').references(() => familyGroups.id, {
    onDelete: 'cascade',
  }),
  ingredients: text('ingredients', { mode: 'json' }).notNull().$type<Ingredient[]>(),
  steps: text('steps', { mode: 'json' }).notNull().$type<Step[]>(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// 食谱共享表
export const recipeShares = sqliteTable('recipe_shares', {
  id: text('id').primaryKey(),
  recipeId: text('recipe_id')
    .notNull()
    .references(() => recipes.id, { onDelete: 'cascade' }),
  sourceFamilyGroupId: text('source_family_group_id')
    .references(() => familyGroups.id),
  targetFamilyGroupId: text('target_family_group_id')
    .notNull()
    .references(() => familyGroups.id, { onDelete: 'cascade' }),
  shareType: text('share_type', { enum: ['copy', 'link'] }).notNull(),
  sharedBy: text('shared_by')
    .notNull()
    .references(() => users.id),
  sharedAt: integer('shared_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// 菜单表
export const menus = sqliteTable('menus', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  status: text('status', {
    enum: ['draft', 'published', 'archived'],
  })
    .notNull()
    .default('draft'),
  familyGroupId: text('family_group_id')
    .notNull()
    .references(() => familyGroups.id, { onDelete: 'cascade' }),
  createdBy: text('created_by')
    .notNull()
    .references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// 菜单项表
export const menuItems = sqliteTable('menu_items', {
  id: text('id').primaryKey(),
  menuId: text('menu_id')
    .notNull()
    .references(() => menus.id, { onDelete: 'cascade' }),
  recipeId: text('recipe_id')
    .notNull()
    .references(() => recipes.id),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  mealTime: text('meal_time', {
    enum: ['breakfast', 'lunch', 'dinner'],
  }).notNull(),
  note: text('note'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
