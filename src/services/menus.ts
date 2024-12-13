import { 
  Menu, 
  MenuItem, 
  MenuShare,
  CreateMenuInput, 
  UpdateMenuInput,
  AddMenuItemInput,
  UpdateMenuItemInput,
  CreateMenuShareInput,
  MenuFilters
} from '@/types/menus';
import { apiClient } from '@/lib/api-client';

export const menusApi = {
  // 获取菜单列表
  async getMenus(filters?: MenuFilters): Promise<Menu[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    return await apiClient.get<Menu[]>(`/menus?${params.toString()}`);
  },

  // 获取单个菜单
  async getMenu(id: string): Promise<Menu> {
    return await apiClient.get<Menu>(`/menus/${id}`);
  },

  // 创建菜单
  async createMenu(data: CreateMenuInput): Promise<Menu> {
    return await apiClient.post<Menu>('/menus', data);
  },

  // 更新菜单
  async updateMenu(id: string, data: UpdateMenuInput): Promise<Menu> {
    return await apiClient.put<Menu>(`/menus/${id}`, data);
  },

  // 删除菜单
  async deleteMenu(id: string): Promise<void> {
    return await apiClient.delete(`/menus/${id}`);
  },

  // 获取菜单项列表
  async getMenuItems(menuId: string): Promise<MenuItem[]> {
    return await apiClient.get<MenuItem[]>(`/menus/${menuId}/items`);
  },

  // 获取单个菜单项
  async getMenuItem(menuId: string, itemId: string): Promise<MenuItem> {
    return await apiClient.get<MenuItem>(`/menus/${menuId}/items/${itemId}`);
  },

  // 添加菜单项
  async addMenuItem(menuId: string, data: AddMenuItemInput): Promise<MenuItem> {
    return await apiClient.post<MenuItem>(`/menus/${menuId}/items`, data);
  },

  // 更新菜单项
  async updateMenuItem(
    menuId: string, 
    itemId: string, 
    data: UpdateMenuItemInput
  ): Promise<MenuItem> {
    return await apiClient.put<MenuItem>(
      `/menus/${menuId}/items/${itemId}`, 
      data
    );
  },

  // 删除菜单项
  async deleteMenuItem(menuId: string, itemId: string): Promise<void> {
    return await apiClient.delete(`/menus/${menuId}/items/${itemId}`);
  },

  // 重新排序菜单项
  async reorderMenuItems(menuId: string, itemIds: string[]): Promise<void> {
    return await apiClient.post(`/menus/${menuId}/items/reorder`, { itemIds });
  },

  // 获取分享记录列表
  async getMenuShares(menuId: string): Promise<MenuShare[]> {
    return await apiClient.get<MenuShare[]>(`/menus/${menuId}/shares`);
  },

  // 创建分享记录
  async createMenuShare(
    menuId: string, 
    data: CreateMenuShareInput
  ): Promise<MenuShare> {
    return await apiClient.post<MenuShare>(`/menus/${menuId}/shares`, data);
  },

  // 删除分享记录
  async deleteMenuShare(menuId: string, shareId: string): Promise<void> {
    return await apiClient.delete(`/menus/${menuId}/shares/${shareId}`);
  },
};