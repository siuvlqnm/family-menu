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
  register: (data: { userName: string; password: string; name: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
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
          const user = authService.parseUserFromToken(token);
          
          // 保存token到localStorage
          localStorage.setItem('token', token);
          
          set({ 
            token, 
            user, 
            isAuthenticated: true, 
            loading: false 
          });
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
          const user = authService.parseUserFromToken(token);
          
          // 保存token到localStorage
          localStorage.setItem('token', token);
          
          set({ 
            token, 
            user, 
            isAuthenticated: true, 
            loading: false 
          });
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
          isAuthenticated: false 
        });
      },

      checkAuth: () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false });
          return false;
        }

        try {
          const user = authService.parseUserFromToken(token);
          set({ token, user, isAuthenticated: true });
          return true;
        } catch (error) {
          localStorage.removeItem('token');
          set({ 
            token: null, 
            user: null, 
            isAuthenticated: false 
          });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
