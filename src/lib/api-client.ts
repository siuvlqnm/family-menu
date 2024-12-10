type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

type ApiClientOptions = {
  baseURL: string;
  getToken?: () => string | null;
};

export class ApiClient {
  private baseURL: string;
  private getToken: () => string | null;

  constructor(options: ApiClientOptions) {
    this.baseURL = options.baseURL;
    this.getToken = options.getToken || (() => null);
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // 添加认证token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method: options.method || 'GET',
      headers,
      credentials: 'include',
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);

    // 处理401错误，可能是token过期
    if (response.status === 401) {
      // 清除本地token
      localStorage.removeItem('token');
      // 重定向到登录页
      window.location.href = '/login';
      throw new Error('认证已过期，请重新登录');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    // 对于204 No Content响应，返回null
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options: Omit<RequestOptions, 'method'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: data });
  }

  async put<T>(endpoint: string, data?: any, options: Omit<RequestOptions, 'method'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: data });
  }

  async delete<T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// 创建API客户端实例
export const apiClient = new ApiClient({
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8787/api'
    : '/api',
  getToken: () => localStorage.getItem('token'),
});
