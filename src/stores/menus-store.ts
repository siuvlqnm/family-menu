import { create } from 'zustand'
import { Menu, MenuItem, MenuShare, MenuFilters, MenuWithItems } from '@/types/menus'
import { menusApi } from '@/services/menus'

interface MenusState {
  menus: Menu[]
  menu: MenuWithItems | null
  menuItems: MenuItem[]
  menuShares: MenuShare[]
  loading: boolean
  error: string | null
  filters: MenuFilters

  fetchMenus: () => Promise<void>
  fetchMenu: (id: string) => Promise<void>
  fetchSharedMenu: (id: string, token: string) => Promise<void>
  fetchMenuItem: (menuId: string, itemId: string) => Promise<MenuItem>
  fetchMenuItems: (menuId: string) => Promise<void>
  fetchMenuShares: (menuId: string) => Promise<void>
  createMenu: (data: Partial<Menu>) => Promise<Menu>
  updateMenu: (id: string, data: Partial<Menu>) => Promise<Menu>
  deleteMenu: (id: string) => Promise<void>
  createMenuItem: (menuId: string, data: Partial<MenuItem>) => Promise<MenuItem>
  updateMenuItem: (menuId: string, itemId: string, data: Partial<MenuItem>) => Promise<MenuItem>
  deleteMenuItem: (menuId: string, itemId: string) => Promise<void>
  createMenuShare: (menuId: string, data: Partial<MenuShare>) => Promise<MenuShare>
  deleteMenuShare: (menuId: string, shareId: string) => Promise<void>
  reorderMenuItems: (menuId: string, itemIds: string[]) => Promise<void>
  setFilters: (filters: MenuFilters) => void
  resetFilters: () => void
  clearMenu: () => void
}

export const useMenuStore = create<MenusState>((set, get) => ({
  menus: [],
  menu: null,
  menuItems: [],
  menuShares: [],
  loading: false,
  error: null,
  filters: {},

  fetchMenus: async () => {
    set({ loading: true, error: null })
    try {
      const response = await menusApi.getMenus(get().filters)
      set({ menus: response.menus, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取菜单列表失败',
        loading: false,
      })
    }
  },

  fetchMenu: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const menu = await menusApi.getMenu(id)
      set({ menu, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取菜单详情失败',
        loading: false,
      })
    }
  },

  fetchSharedMenu: async (id: string, token: string) => {
    set({ loading: true, error: null })
    try {
      const menu = await menusApi.getSharedMenu(id, token)
      set({ menu, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取分享菜单失败',
        loading: false,
      })
    }
  },

  fetchMenuItem: async (menuId: string, itemId: string) => {
    try {
      return await menusApi.getMenuItem(menuId, itemId)
    } catch (error) {
      throw error
    }
  },

  fetchMenuItems: async (menuId: string) => {
    set({ loading: true, error: null })
    try {
      const menuItems = await menusApi.getMenuItems(menuId)
      set({ menuItems, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取菜品列表失败',
        loading: false,
      })
    }
  },

  fetchMenuShares: async (menuId: string) => {
    set({ loading: true, error: null })
    try {
      const menuShares = await menusApi.getMenuShares(menuId)
      set({ menuShares, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取分享记录失败',
        loading: false,
      })
    }
  },

  createMenu: async (data: Partial<Menu>) => {
    try {
      const menu = await menusApi.createMenu(data)
      set((state) => ({ menus: [...state.menus, menu] }))
      return menu
    } catch (error) {
      throw error
    }
  },

  updateMenu: async (id: string, data: Partial<Menu>) => {
    try {
      const menu = await menusApi.updateMenu(id, data)
      set((state) => ({
        menus: state.menus.map((m) => (m.id === id ? menu : m)),
        menu: state.menu?.id === id ? menu : state.menu,
      }))
      return menu
    } catch (error) {
      throw error
    }
  },

  deleteMenu: async (id: string) => {
    try {
      await menusApi.deleteMenu(id)
      set((state) => ({
        menus: state.menus.filter((m) => m.id !== id),
        menu: state.menu?.id === id ? null : state.menu,
      }))
    } catch (error) {
      throw error
    }
  },

  createMenuItem: async (menuId: string, data: Partial<MenuItem>) => {
    try {
      const menuItem = await menusApi.addMenuItem(menuId, data)
      set((state) => ({ menuItems: [...state.menuItems, menuItem] }))
      return menuItem
    } catch (error) {
      throw error
    }
  },

  updateMenuItem: async (menuId: string, itemId: string, data: Partial<MenuItem>) => {
    try {
      const menuItem = await menusApi.updateMenuItem(menuId, itemId, data)
      set((state) => ({
        menuItems: state.menuItems.map((item) =>
          item.id === itemId ? menuItem : item
        ),
      }))
      return menuItem
    } catch (error) {
      throw error
    }
  },

  deleteMenuItem: async (menuId: string, itemId: string) => {
    try {
      await menusApi.deleteMenuItem(menuId, itemId)
      set((state) => ({
        menuItems: state.menuItems.filter((item) => item.id !== itemId),
      }))
    } catch (error) {
      throw error
    }
  },

  createMenuShare: async (menuId: string, data: Partial<MenuShare>) => {
    try {
      const menuShare = await menusApi.createMenuShare(menuId, data)
      set((state) => ({ menuShares: [...state.menuShares, menuShare] }))
      return menuShare
    } catch (error) {
      throw error
    }
  },

  deleteMenuShare: async (menuId: string, shareId: string) => {
    try {
      await menusApi.deleteMenuShare(menuId, shareId)
      set((state) => ({
        menuShares: state.menuShares.filter((share) => share.id !== shareId),
      }))
    } catch (error) {
      throw error
    }
  },

  reorderMenuItems: async (menuId: string, itemIds: string[]) => {
    try {
      await menusApi.reorderMenuItems(menuId, itemIds)
      const menuItems = itemIds
        .map((id) => get().menuItems.find((item) => item.id === id))
        .filter((item): item is MenuItem => item !== undefined)
      set({ menuItems })
    } catch (error) {
      throw error
    }
  },

  setFilters: (filters: MenuFilters) => {
    set({ filters })
  },

  resetFilters: () => {
    set({ filters: {} })
  },

  clearMenu: () => {
    set({ menu: null, menuItems: [], menuShares: [] })
  },
}))
