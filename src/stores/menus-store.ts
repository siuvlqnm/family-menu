import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Menu, MenuItem, MenuShare, MenuFilters, CreateMenuInput, UpdateMenuInput, AddMenuItemInput, UpdateMenuItemInput, CreateMenuShareInput } from '@/types/menus'
import { api } from '@/lib/api'

interface MenusState {
  menus: Menu[]
  currentMenu: Menu | null
  menuItems: MenuItem[]
  menuShares: MenuShare[]
  loading: boolean
  error: string | null
  filters: MenuFilters

  fetchMenus: () => Promise<void>
  getMenu: (id: string) => Promise<void>
  getMenuItems: (menuId: string) => Promise<void>
  getMenuShares: (menuId: string) => Promise<void>
  createMenu: (input: CreateMenuInput) => Promise<Menu>
  updateMenu: (id: string, input: UpdateMenuInput) => Promise<Menu>
  deleteMenu: (id: string) => Promise<void>
  addMenuItem: (menuId: string, input: AddMenuItemInput) => Promise<void>
  updateMenuItem: (menuId: string, itemId: string, input: UpdateMenuItemInput) => Promise<void>
  deleteMenuItem: (menuId: string, itemId: string) => Promise<void>
  createMenuShare: (menuId: string, input: CreateMenuShareInput) => Promise<MenuShare>
  deleteMenuShare: (menuId: string, shareId: string) => Promise<void>
  setFilters: (filters: MenuFilters) => void
  resetFilters: () => void
}

export const useMenuStore = create<MenusState>()(
  devtools(
    (set, get) => ({
      menus: [],
      currentMenu: null,
      menuItems: [],
      menuShares: [],
      loading: false,
      error: null,
      filters: {},

      fetchMenus: async () => {
        try {
          set({ loading: true, error: null })
          const { data } = await api.get('/menus', {
            params: get().filters,
          })
          set({ menus: data.menus })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : '获取菜单列表失败' })
        } finally {
          set({ loading: false })
        }
      },

      getMenu: async (id: string) => {
        try {
          set({ loading: true, error: null })
          const { data } = await api.get(`/menus/${id}`)
          set({ currentMenu: data.menu })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : '获取菜单详情失败' })
        } finally {
          set({ loading: false })
        }
      },

      getMenuItems: async (menuId: string) => {
        try {
          set({ loading: true, error: null })
          const { data } = await api.get(`/menus/${menuId}/items`)
          set({ menuItems: data.menuItems })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : '获取菜品列表失败' })
        } finally {
          set({ loading: false })
        }
      },

      getMenuShares: async (menuId: string) => {
        try {
          set({ loading: true, error: null })
          const { data } = await api.get(`/menus/${menuId}/shares`)
          set({ menuShares: data.menuShares })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : '获取分享记录失败' })
        } finally {
          set({ loading: false })
        }
      },

      createMenu: async (input: CreateMenuInput) => {
        try {
          set({ loading: true, error: null })
          const { data } = await api.post('/menus', input)
          set((state) => ({ menus: [...state.menus, data.menu] }))
          return data.menu
        } catch (error) {
          set({ error: error instanceof Error ? error.message : '创建菜单失败' })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      updateMenu: async (id: string, input: UpdateMenuInput) => {
        try {
          set({ loading: true, error: null })
          const { data } = await api.put(`/menus/${id}`, input)
          set((state) => ({
            menus: state.menus.map((menu) => (menu.id === id ? data.menu : menu)),
            currentMenu: state.currentMenu?.id === id ? data.menu : state.currentMenu,
          }))
          return data.menu
        } catch (error) {
          set({ error: error instanceof Error ? error.message : '更新菜单失败' })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      deleteMenu: async (id: string) => {
        try {
          set({ loading: true, error: null })
          await api.delete(`/menus/${id}`)
          set((state) => ({
            menus: state.menus.filter((menu) => menu.id !== id),
            currentMenu: state.currentMenu?.id === id ? null : state.currentMenu,
          }))
        } catch (error) {
          set({ error: error instanceof Error ? error.message : '删除菜单失败' })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      addMenuItem: async (menuId: string, input: AddMenuItemInput) => {
        try {
          set({ loading: true, error: null })
          const { data } = await api.post(`/menus/${menuId}/items`, input)
          set((state) => ({
            menuItems: [...state.menuItems, data.menuItem],
          }))
        } catch (error) {
          set({ error: error instanceof Error ? error.message : '添加菜单项失败' })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      updateMenuItem: async (menuId: string, itemId: string, input: UpdateMenuItemInput) => {
        try {
          set({ loading: true, error: null })
          const { data } = await api.put(`/menus/${menuId}/items/${itemId}`, input)
          set((state) => ({
            menuItems: state.menuItems.map((item) =>
              item.id === itemId ? data.menuItem : item
            ),
          }))
        } catch (error) {
          set({ error: error instanceof Error ? error.message : '更新菜单项失败' })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      deleteMenuItem: async (menuId: string, itemId: string) => {
        try {
          set({ loading: true, error: null })
          await api.delete(`/menus/${menuId}/items/${itemId}`)
          set((state) => ({
            menuItems: state.menuItems.filter((item) => item.id !== itemId),
          }))
        } catch (error) {
          set({ error: error instanceof Error ? error.message : '删除菜单项失败' })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      createMenuShare: async (menuId: string, input: CreateMenuShareInput) => {
        try {
          set({ loading: true, error: null })
          const { data } = await api.post(`/menus/${menuId}/shares`, input)
          set((state) => ({ menuShares: [...state.menuShares, data.menuShare] }))
          return data.menuShare
        } catch (error) {
          set({ error: error instanceof Error ? error.message : '创建分享记录失败' })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      deleteMenuShare: async (menuId: string, shareId: string) => {
        try {
          set({ loading: true, error: null })
          await api.delete(`/menus/${menuId}/shares/${shareId}`)
          set((state) => ({
            menuShares: state.menuShares.filter((share) => share.id !== shareId),
          }))
        } catch (error) {
          set({ error: error instanceof Error ? error.message : '删除分享记录失败' })
          throw error
        } finally {
          set({ loading: false })
        }
      },

      setFilters: (filters: MenuFilters) => {
        set({ filters })
      },

      resetFilters: () => {
        set({ filters: {} })
      },
    }),
    { name: 'menus-store' }
  )
)
