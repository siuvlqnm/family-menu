import { Recipe } from '@/types/recipe';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const recipeApi = {
  // 获取单个食谱
  async getRecipe(id: string): Promise<Recipe> {
    const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipe');
    }
    return response.json();
  },

  // 更新食谱
  async updateRecipe(id: string, data: Partial<Recipe>): Promise<Recipe> {
    const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update recipe');
    }
    return response.json();
  },

  // 创建食谱
  async createRecipe(data: Omit<Recipe, 'id'>): Promise<Recipe> {
    const response = await fetch(`${API_BASE_URL}/api/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create recipe');
    }
    return response.json();
  },

  // 获取食谱列表
  async getRecipes(params?: URLSearchParams): Promise<{ recipes: Recipe[]; total: number }> {
    const url = new URL(`${API_BASE_URL}/api/recipes`);
    if (params) {
      url.search = params.toString();
    }
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return response.json();
  },

  // 删除食谱
  async deleteRecipe(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete recipe');
    }
  },
}
