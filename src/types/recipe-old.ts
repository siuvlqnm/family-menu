import { User } from './auth';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface RecipeStep {
  id: string;
  order: number;
  description: string;
  duration?: number;
  image?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  steps: RecipeStep[];
  images: string[];
  createdBy: User;
  tags: string[];
  favorites: number;
  rating: number;
  nutrition?: NutritionInfo;
}

export interface RecipeFilters {
  category?: string;
  difficulty?: Recipe['difficulty'];
  search?: string;
  tags?: string[];
  sort?: 'latest' | 'popular' | 'rating';
}
