import { create } from 'zustand';
import { Recipe, RecipeFilters, CreateRecipeInput, UpdateRecipeInput } from '@/types/recipes';
import { recipesApi } from '@/services/recipes';

interface RecipeState {
  recipes: Recipe[];
  filters: RecipeFilters;
  loading: boolean;
  error: string | null;
  recipe: Recipe | null;
  recipeLoading: boolean;
  recipeError: string | null;
  setFilters: (filters: RecipeFilters) => void;
  fetchRecipes: () => Promise<void>;
  fetchRecipe: (id: string) => Promise<void>;
  createRecipe: (recipe: CreateRecipeInput) => Promise<void>;
  updateRecipe: (id: string, recipe: UpdateRecipeInput) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  // 初始状态
  recipes: [],
  filters: {},
  loading: false,
  error: null,
  recipe: null,
  recipeLoading: false,
  recipeError: null,

  // 设置筛选条件
  setFilters: (filters) => {
    set({ filters });
    get().fetchRecipes();
  },

  // 获取食谱列表
  fetchRecipes: async () => {
    const { filters } = get();
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      
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
        const validSorts = ['latest', 'popular', 'rating'] as const;
        const sortValue = validSorts.find(s => s === filters.sort);
        if (sortValue) {
          params.append('sort', sortValue);
        }
      }

      const response = await recipesApi.getRecipes(params);
      set({ recipes: response, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取食谱列表失败', 
        loading: false 
      });
    }
  },

  // 获取单个食谱
  fetchRecipe: async (id: string) => {
    set({ recipeLoading: true, recipeError: null });
    try {
      const recipe = await recipesApi.getRecipe(id);
      // 转换时间字段
      const processedRecipe = {
        ...recipe,
        createdAt: new Date(recipe.createdAt).toISOString(),
        updatedAt: new Date(recipe.updatedAt).toISOString()
      };
      set({ recipe: processedRecipe, recipeLoading: false });
    } catch (error) {
      set({ 
        recipeError: error instanceof Error ? error.message : '获取食谱详情失败', 
        recipeLoading: false 
      });
    }
  },

  // 创建食谱
  createRecipe: async (data: CreateRecipeInput) => {
    try {
      const newRecipe = await recipesApi.createRecipe(data);
      // 转换时间字段
      const processedRecipe = {
        ...newRecipe,
        createdAt: new Date(newRecipe.createdAt).toISOString(),
        updatedAt: new Date(newRecipe.updatedAt).toISOString()
      };
      set(state => ({
        recipes: [processedRecipe, ...state.recipes],
      }));
    } catch (error) {
      throw error;
    }
  },

  // 更新食谱
  updateRecipe: async (id: string, data: UpdateRecipeInput) => {
    try {
      const updatedRecipe = await recipesApi.updateRecipe(id, data);
      // 转换时间字段
      const processedRecipe = {
        ...updatedRecipe,
        createdAt: new Date(updatedRecipe.createdAt).toISOString(),
        updatedAt: new Date(updatedRecipe.updatedAt).toISOString()
      };
      set(state => ({
        recipes: state.recipes.map(recipe => 
          recipe.id === id ? processedRecipe : recipe
        ),
        recipe: state.recipe?.id === id ? processedRecipe : state.recipe,
      }));
    } catch (error) {
      throw error;
    }
  },

  // 删除食谱
  deleteRecipe: async (id: string) => {
    try {
      await recipesApi.deleteRecipe(id);
      set(state => ({
        recipes: state.recipes.filter(recipe => recipe.id !== id),
        recipe: state.recipe?.id === id ? null : state.recipe,
      }));
    } catch (error) {
      throw error;
    }
  },

  // 收藏/取消收藏食谱
  toggleFavorite: async (id: string) => {
    try {
      const updatedRecipe = await recipesApi.toggleFavorite(id);
      // 转换时间字段
      const processedRecipe = {
        ...updatedRecipe,
        createdAt: new Date(updatedRecipe.createdAt).toISOString(),
        updatedAt: new Date(updatedRecipe.updatedAt).toISOString()
      };
      set(state => ({
        recipes: state.recipes.map(recipe => 
          recipe.id === id ? processedRecipe : recipe
        ),
        recipe: state.recipe?.id === id ? processedRecipe : state.recipe,
      }));
    } catch (error) {
      throw error;
    }
  },
}));
