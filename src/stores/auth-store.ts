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

  login: (userName: string, password: string) => Promise<boolean>;
  register: (data: { userName: string; name: string; password: string }) => Promise<void>;
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

      login: async (userName: string, password: string): Promise<boolean> => {
        set({ loading: true, error: null });
        try {
          const { token } = await authService.login({ userName, password });
          
          // 保存token到localStorage和state
          localStorage.setItem('token', token);
          set({ token, isAuthenticated: true, loading: false });
          
          // 获取用户信息
          await get().fetchUser();
          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '登录失败', 
            loading: false,
            isAuthenticated: false,
            token: null,
            user: null
          });
          return false;
        }
      },

      register: async (data) => {
        set({ loading: true, error: null });
        try {
          const { token } = await authService.register(data);
          
          // 保存token到localStorage
          localStorage.setItem('token', token);
          set({ token, isAuthenticated: true, loading: false });
          
          // 获取用户信息
          await get().fetchUser();
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '注册失败', 
            loading: false,
            isAuthenticated: false,
            token: null,
            user: null
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
          error: null,
        });
      },

      checkAuth: () => {
        const token = localStorage.getItem('token');
        const { isAuthenticated } = get();
        
        // 如果已经认证，直接返回true
        if (isAuthenticated && token) {
          return true;
        }
        
        // 如果有token但未认证，设置认证状态
        if (token && !isAuthenticated) {
          set({ token, isAuthenticated: true });
          return true;
        }
        
        return false;
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
            token: null,
            error: error instanceof Error ? error.message : '获取用户信息失败'
          });
          localStorage.removeItem('token');
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
