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

export interface Ingredient {
  name: string;
  // amount: number;
  quantity: number;
  unit: keyof typeof MeasurementUnit;
  orderIndex: number;
}

export interface Step {
  description: string;
  duration?: number;
  orderIndex: number;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  category: keyof typeof RecipeCategory;
  difficulty: keyof typeof DifficultyLevel;
  prepTime: number;
  cookTime: number;
  servings: number;
  createdBy: string;
  familyGroupId: string;
  ingredients: Ingredient[];
  steps: Step[];
  favorites: number;
  rating: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeInput {
  name: string;
  description?: string;
  category: keyof typeof RecipeCategory;
  difficulty: keyof typeof DifficultyLevel;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  familyGroupId?: string;
  ingredients: Ingredient[];
  steps: Step[];
}

export interface UpdateRecipeInput extends Partial<CreateRecipeInput> {}

export interface RecipeFilters {
  category?: keyof typeof RecipeCategory;
  difficulty?: keyof typeof DifficultyLevel;
  search?: string;
  tags?: string[];
  sort?: 'latest' | 'popular' | 'rating';
  page?: number;
  limit?: number;
}
