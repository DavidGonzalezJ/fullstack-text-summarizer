import axios from 'axios';
import { API_BASE } from '../utils/api';

// Module-level token updated by AuthContext on login/logout
let currentToken: string | null = null;

export function setAxiosToken(token: string | null): void {
  currentToken = token;
}

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use(config => {
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

export default api;
