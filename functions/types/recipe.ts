import { z } from 'zod';

// 食谱分类
export const RecipeCategory = {
  MEAT: '荤菜',
  VEGETABLE: '素菜',
  SOUP: '汤类',
  STAPLE: '主食',
  SNACK: '小吃',
} as const;

// 难度等级
export const DifficultyLevel = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

// 计量单位
export const MeasurementUnit = {
  GRAM: 'g',
  MILLILITER: 'ml',
  PIECE: '个',
  WHOLE: '只',
  ROOT: '根',
  SLICE: '片',
  SPOON: '勺',
  AS_NEEDED: '适量',
} as const;

// 配料验证 schema
export const ingredientSchema = z.object({
  name: z.string().min(1),
  amount: z.number().min(0),
  unit: z.nativeEnum(MeasurementUnit),
  orderIndex: z.number().int().min(0),
});

// 步骤验证 schema
export const stepSchema = z.object({
  description: z.string().min(1),
  duration: z.number().int().min(0).optional(),
  orderIndex: z.number().int().min(0),
});

// 创建食谱验证 schema
export const createRecipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.nativeEnum(RecipeCategory),
  difficulty: z.nativeEnum(DifficultyLevel),
  prepTime: z.number().int().min(0).optional(),
  cookTime: z.number().int().min(0).optional(),
  servings: z.number().int().min(1).optional(),
  ingredients: z.array(ingredientSchema),
  steps: z.array(stepSchema),
  familyGroupId: z.string().optional(),
});

// 更新食谱验证 schema
export const updateRecipeSchema = createRecipeSchema.partial();

// 食谱查询参数验证 schema
export const recipeQuerySchema = z.object({
  category: z.nativeEnum(RecipeCategory).optional(),
  difficulty: z.nativeEnum(DifficultyLevel).optional(),
  search: z.string().optional(),
  familyGroupId: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
});

// 类型定义
export type Ingredient = z.infer<typeof ingredientSchema>;
export type Step = z.infer<typeof stepSchema>;
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
export type RecipeQuery = z.infer<typeof recipeQuerySchema>;

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  category: typeof RecipeCategory[keyof typeof RecipeCategory];
  difficulty: typeof DifficultyLevel[keyof typeof DifficultyLevel];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  createdBy: string;
  familyGroupId?: string;
  ingredients: Ingredient[];
  steps: Step[];
  createdAt: Date;
  updatedAt: Date;
}
