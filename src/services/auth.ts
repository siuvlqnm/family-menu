import { LoginCredentials, RegisterData, User } from '@/types/auth';
import { apiClient } from '@/lib/api-client';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ token: string }> {
    return apiClient.post('/auth/login', credentials);
  },

  async register(data: RegisterData): Promise<{ token: string }> {
    return apiClient.post('/auth/register', data);
  },

  // 从token中解析用户信息
  parseUserFromToken(token: string): User {
    try {
      // Base64解码JWT payload部分
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        userName: payload.userName, // 修改为userName
        familyGroups: payload.familyGroups || [],
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      throw new Error('Invalid token format');
    }
  },
};
