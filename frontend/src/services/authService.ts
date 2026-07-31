import api from '../lib/axios';

export interface LoginResponse {
  username: string;
  email: string;
  accessToken: string;
}

export interface RegisterResponse {
  username: string;
  email: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    return data;
  },

  async register(username: string, email: string, password: string): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>('/auth/register', { username, email, password });
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async refresh(): Promise<RefreshResponse> {
    const { data } = await api.post<RefreshResponse>('/auth/refresh');
    return data;
  },
};
