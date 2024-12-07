import { create } from 'zustand';
import { Recipe, RecipeFilters } from '@/types/recipe';
import { recipeApi } from '@/services/recipe';

interface RecipeState {
  recipes: Recipe[];
  filters: RecipeFilters;
  loading: boolean;
  error: string | null;
  setFilters: (filters: RecipeFilters) => void;
  fetchRecipes: () => Promise<void>;
  addRecipe: (recipe: Omit<Recipe, 'id'>) => Promise<void>;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: [],
  filters: {},
  loading: false,
  error: null,

  setFilters: (filters) => {
    set({ filters });
    // 当筛选条件改变时，重新获取食谱
    get().fetchRecipes();
  },

  fetchRecipes: async () => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      const filters = get().filters;
      
      if (filters.category) {
        params.append('category', filters.category);
      }
      if (filters.difficulty) {
        params.append('difficulty', filters.difficulty);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.tags?.length) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }
      if (filters.sort) {
        params.append('sort', filters.sort);
      }

      const { recipes } = await recipeApi.getRecipes(params);
      set({ recipes, loading: false });
    } catch (error) {
      set({ error: '获取食谱失败', loading: false });
    }
  },

  addRecipe: async (recipe) => {
    set({ loading: true, error: null });
    try {
      const newRecipe = await recipeApi.createRecipe(recipe);
      set(state => ({
        recipes: [...state.recipes, newRecipe],
        loading: false,
      }));
    } catch (error) {
      set({ error: '添加食谱失败', loading: false });
      throw error;
    }
  },

  updateRecipe: async (id, recipe) => {
    set({ loading: true, error: null });
    try {
      const updatedRecipe = await recipeApi.updateRecipe(id, recipe);
      set(state => ({
        recipes: state.recipes.map(r => r.id === id ? updatedRecipe : r),
        loading: false,
      }));
    } catch (error) {
      set({ error: '更新食谱失败', loading: false });
      throw error;
    }
  },

  deleteRecipe: async (id) => {
    set({ loading: true, error: null });
    try {
      await recipeApi.deleteRecipe(id);
      set(state => ({
        recipes: state.recipes.filter(r => r.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: '删除食谱失败', loading: false });
      throw error;
    }
  },

  toggleFavorite: async (id) => {
    try {
      const recipe = get().recipes.find(r => r.id === id);
      if (!recipe) return;

      const updatedRecipe = await recipeApi.updateRecipe(id, {
        isFavorite: !recipe.isFavorite,
      });

      set(state => ({
        recipes: state.recipes.map(r => r.id === id ? updatedRecipe : r),
      }));
    } catch (error) {
      set({ error: '更新收藏状态失败' });
      throw error;
    }
  },
}));
