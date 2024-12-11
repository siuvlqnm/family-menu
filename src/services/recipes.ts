import { Recipe, CreateRecipeInput, UpdateRecipeInput, RecipeFilters } from '@/types/recipes';
import { apiClient } from '@/lib/api-client';

export const recipeApi = {
  // 获取单个食谱
  async getRecipe(id: string): Promise<Recipe> {
    return await apiClient.get<Recipe>(`/recipes/${id}`);
  },

  // 更新食谱
  async updateRecipe(id: string, data: UpdateRecipeInput): Promise<Recipe> {
    return await apiClient.put<Recipe>(`/recipes/${id}`, data);
  },

  // 创建食谱
  async createRecipe(data: CreateRecipeInput): Promise<Recipe> {
    return await apiClient.post<Recipe>('/recipes', data);
  },

  // 获取食谱列表
  async getRecipes(filters?: RecipeFilters): Promise<Recipe[]> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.search) params.append('search', filters.search);
      if (filters.tags?.length) params.append('tags', filters.tags.join(','));
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
    }

    return await apiClient.get<Recipe[]>(`/recipes?${params.toString()}`);
  },

  // 删除食谱
  async deleteRecipe(id: string): Promise<void> {
    return await apiClient.delete(`/recipes/${id}`);
  },
};
