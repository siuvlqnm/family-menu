"use client";

import { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '@/types/auth';
import { authService } from '@/services/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true };
    case 'SET_USER':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'CLEAR_USER':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored auth token and validate it
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          const user = authService.parseUserFromToken(storedToken);
          dispatch({ type: 'SET_USER', payload: user });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        if (!state.user) {
          dispatch({ type: 'CLEAR_USER' });
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const { token } = await authService.login(credentials);
      const user = authService.parseUserFromToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'CLEAR_USER' });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const { token } = await authService.register(data);
      const user = authService.parseUserFromToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'CLEAR_USER' });
      throw error;
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: 'CLEAR_USER' });
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
