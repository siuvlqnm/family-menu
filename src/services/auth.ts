import { LoginCredentials, RegisterData, User } from '@/types/auth';
import { apiClient } from '@/lib/api-client';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ token: string }> {
    return apiClient.post('/auth/login', credentials);
  },

  async register(data: RegisterData): Promise<{ token: string }> {
    return apiClient.post('/auth/register', data);
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get('/auth/me');
  },
};
