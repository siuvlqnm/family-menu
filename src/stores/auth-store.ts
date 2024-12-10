import { create } from 'zustand';
import { User } from '@/types/auth';
import { authService } from '@/services/auth';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  login: (userName: string, password: string) => Promise<void>;
  register: (data: { userName: string; password: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      login: async (userName: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const { token } = await authService.login({ userName, password });
          
          // 保存token到localStorage
          localStorage.setItem('token', token);
          
          set({ token, loading: false });
          
          // 获取用户信息
          await get().fetchUser();
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '登录失败', 
            loading: false,
            isAuthenticated: false
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ loading: true, error: null });
        try {
          const { token } = await authService.register(data);
          
          // 保存token到localStorage
          localStorage.setItem('token', token);
          
          set({ token, loading: false });
          
          // 获取用户信息
          await get().fetchUser();
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '注册失败', 
            loading: false,
            isAuthenticated: false
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null
        });
      },

      checkAuth: () => {
        const token = localStorage.getItem('token');
        const { user } = get();
        
        if (!token) {
          set({ isAuthenticated: false });
          return false;
        }

        if (!user) {
          // 如果有token但没有用户信息，尝试获取用户信息
          get().fetchUser().catch(() => {
            set({ isAuthenticated: false });
          });
        }

        return true;
      },

      fetchUser: async () => {
        try {
          const user = await authService.getCurrentUser();
          set({ 
            user, 
            isAuthenticated: true 
          });
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false,
            error: error instanceof Error ? error.message : '获取用户信息失败'
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
