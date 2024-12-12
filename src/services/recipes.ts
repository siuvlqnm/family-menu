import { Recipe, CreateRecipeInput, UpdateRecipeInput } from '@/types/recipes';
import { apiClient } from '@/lib/api-client';

export const recipesApi = {
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
  async getRecipes(params: URLSearchParams): Promise<Recipe[]> {
    return await apiClient.get<Recipe[]>(`/recipes?${params.toString()}`);
  },

  // 删除食谱
  async deleteRecipe(id: string): Promise<void> {
    return await apiClient.delete(`/recipes/${id}`);
  },
};
