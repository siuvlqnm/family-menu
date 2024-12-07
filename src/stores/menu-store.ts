import { create } from 'zustand';
import { Menu, MenuFilters } from '@/types/menu';
import { mockMenus } from '@/lib/mock/data';

interface MenuState {
  menus: Menu[];
  filters: MenuFilters;
  loading: boolean;
  error: string | null;
  setFilters: (filters: MenuFilters) => void;
  fetchMenus: () => Promise<void>;
  addMenu: (menu: Omit<Menu, 'id'>) => Promise<void>;
  updateMenu: (id: string, menu: Partial<Menu>) => Promise<void>;
  deleteMenu: (id: string) => Promise<void>;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  menus: [],
  filters: {},
  loading: false,
  error: null,

  setFilters: (filters) => {
    set({ filters });
  },

  fetchMenus: async () => {
    set({ loading: true, error: null });
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ menus: mockMenus, loading: false });
    } catch (error) {
      set({ error: '获取菜单失败', loading: false });
    }
  },

  addMenu: async (menu) => {
    set({ loading: true, error: null });
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newMenu = {
        ...menu,
        id: String(Date.now()),
      };
      set(state => ({
        menus: [...state.menus, newMenu as Menu],
        loading: false,
      }));
    } catch (error) {
      set({ error: '添加菜单失败', loading: false });
    }
  },

  updateMenu: async (id, menu) => {
    set({ loading: true, error: null });
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(state => ({
        menus: state.menus.map(m =>
          m.id === id ? { ...m, ...menu } : m
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: '更新菜单失败', loading: false });
    }
  },

  deleteMenu: async (id) => {
    set({ loading: true, error: null });
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(state => ({
        menus: state.menus.filter(m => m.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: '删除菜单失败', loading: false });
    }
  },
}));
