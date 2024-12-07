import { create } from 'zustand';
import { ShoppingList, ShoppingFilters, ShoppingItem } from '@/types/shopping';
import { mockShoppingLists } from '@/lib/mock/data';

interface ShoppingState {
  lists: ShoppingList[];
  filters: ShoppingFilters;
  loading: boolean;
  error: string | null;
  setFilters: (filters: ShoppingFilters) => void;
  fetchLists: () => Promise<void>;
  addList: (list: Omit<ShoppingList, 'id'>) => Promise<void>;
  updateList: (id: string, list: Partial<ShoppingList>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  toggleItem: (listId: string, itemId: string) => Promise<void>;
  addItem: (listId: string, item: Omit<ShoppingItem, 'id' | 'completed'>) => Promise<void>;
  removeItem: (listId: string, itemId: string) => Promise<void>;
}

export const useShoppingStore = create<ShoppingState>((set, get) => ({
  lists: [],
  filters: {},
  loading: false,
  error: null,

  setFilters: (filters) => {
    set({ filters });
  },

  fetchLists: async () => {
    set({ loading: true, error: null });
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ lists: mockShoppingLists, loading: false });
    } catch (error) {
      set({ error: '获取购物清单失败', loading: false });
    }
  },

  addList: async (list) => {
    set({ loading: true, error: null });
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newList = {
        ...list,
        id: String(Date.now()),
      };
      set(state => ({
        lists: [...state.lists, newList as ShoppingList],
        loading: false,
      }));
    } catch (error) {
      set({ error: '添加购物清单失败', loading: false });
    }
  },

  updateList: async (id, list) => {
    set({ loading: true, error: null });
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(state => ({
        lists: state.lists.map(l =>
          l.id === id ? { ...l, ...list } : l
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: '更新购物清单失败', loading: false });
    }
  },

  deleteList: async (id) => {
    set({ loading: true, error: null });
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(state => ({
        lists: state.lists.filter(l => l.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: '删除购物清单失败', loading: false });
    }
  },

  toggleItem: async (listId, itemId) => {
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({
        lists: state.lists.map(list =>
          list.id === listId
            ? {
                ...list,
                items: list.items.map(item =>
                  item.id === itemId
                    ? {
                        ...item,
                        completed: !item.completed,
                        completedAt: !item.completed ? new Date().toISOString() : undefined,
                        completedBy: !item.completed ? get().lists[0].createdBy : undefined,
                      }
                    : item
                ),
              }
            : list
        ),
      }));
    } catch (error) {
      set({ error: '操作失败' });
    }
  },

  addItem: async (listId, item) => {
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 500));
      const newItem: ShoppingItem = {
        ...item,
        id: String(Date.now()),
        completed: false,
      };
      set(state => ({
        lists: state.lists.map(list =>
          list.id === listId
            ? { ...list, items: [...list.items, newItem] }
            : list
        ),
      }));
    } catch (error) {
      set({ error: '添加物品失败' });
    }
  },

  removeItem: async (listId, itemId) => {
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({
        lists: state.lists.map(list =>
          list.id === listId
            ? { ...list, items: list.items.filter(item => item.id !== itemId) }
            : list
        ),
      }));
    } catch (error) {
      set({ error: '删除物品失败' });
    }
  },
}));
