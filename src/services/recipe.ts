import { Recipe, CreateRecipeInput, UpdateRecipeInput, RecipeFilters } from '@/types/recipe';
import { apiClient } from '@/lib/api-client';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const recipeApi = {
  // 获取单个食谱
  async getRecipe(id: string): Promise<Recipe> {
    const response = await apiClient.get(`/recipes/${id}`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch recipe');
    }
    return response.json();
  },

  // 更新食谱
  async updateRecipe(id: string, data: UpdateRecipeInput): Promise<Recipe> {
    const response = await apiClient.put(`/recipes/${id}`, data);
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to update recipe');
    }
    return response.json();
  },

  // 创建食谱
  async createRecipe(data: CreateRecipeInput): Promise<Recipe> {
    const response = await apiClient.post('/recipes', data);
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to create recipe');
    }
    return response.json();
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

    const response = await apiClient.get(`/recipes?${params.toString()}`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch recipes');
    }
    return response.json();
  },

  // 删除食谱
  async deleteRecipe(id: string): Promise<void> {
    const response = await apiClient.delete(`/recipes/${id}`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to delete recipe');
    }
  },
};
