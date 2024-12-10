import { create } from 'zustand';
import { Recipe, RecipeFilters, CreateRecipeInput, UpdateRecipeInput } from '@/types/recipe';
import { recipeApi } from '@/services/recipe';

interface RecipeState {
  // 列表状态
  recipes: Recipe[];
  filters: RecipeFilters;
  loading: boolean;
  error: string | null;
  
  // 单个食谱状态
  recipe: Recipe | null;
  recipeLoading: boolean;
  recipeError: string | null;

  // 操作方法
  setFilters: (filters: RecipeFilters) => void;
  fetchRecipes: () => Promise<void>;
  fetchRecipe: (id: string) => Promise<void>;
  createRecipe: (recipe: CreateRecipeInput) => Promise<void>;
  updateRecipe: (id: string, recipe: UpdateRecipeInput) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
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
      const recipe = await recipeApi.getRecipe(id);
      set({ recipe, recipeLoading: false });
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
      const newRecipe = await recipeApi.createRecipe(data);
      set(state => ({
        recipes: [newRecipe, ...state.recipes],
        loading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '创建食谱失败', loading: false });
      throw error;
    }
  },

  // 更新食谱
  updateRecipe: async (id: string, data: UpdateRecipeInput) => {
    set({ loading: true, error: null });
    try {
      const updatedRecipe = await recipeApi.updateRecipe(id, data);
      set(state => ({
        recipes: state.recipes.map(recipe => 
          recipe.id === id ? updatedRecipe : recipe
        ),
        recipe: updatedRecipe,
        loading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '更新食谱失败', 
        loading: false 
      });
      throw error;
    }
  },

  // 删除食谱
  deleteRecipe: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await recipeApi.deleteRecipe(id);
      set(state => ({
        recipes: state.recipes.filter(recipe => recipe.id !== id),
        recipe: state.recipe?.id === id ? null : state.recipe,
        loading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '删除食谱失败', 
        loading: false 
      });
      throw error;
    }
  },
}));
