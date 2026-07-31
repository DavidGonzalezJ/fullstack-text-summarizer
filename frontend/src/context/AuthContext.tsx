import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { setAxiosToken } from '../lib/axios';
import { authService } from '../services/authService';

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  restoring: boolean;
  setAuth: (user: User, accessToken: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = 'user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedUser) {
      setRestoring(false);
      return;
    }

    authService.refresh()
      .then(data => {
        setUser(JSON.parse(storedUser) as User);
        setAccessToken(data.accessToken);
        setAxiosToken(data.accessToken);
      })
      .catch(() => {
        localStorage.removeItem(USER_KEY);
      })
      .finally(() => setRestoring(false));
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setAxiosToken(null);
    localStorage.removeItem(USER_KEY);
  }, []);

  const setAuth = useCallback((user: User, accessToken: string) => {
    setUser(user);
    setAccessToken(accessToken);
    setAxiosToken(accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Clear locally even if server request fails
    }
    clearAuth();
  }, [clearAuth]);

  return (
    <AuthContext.Provider value={{ user, accessToken, restoring, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
