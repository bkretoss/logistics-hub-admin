import React, { createContext, useContext, useState, useCallback } from 'react';
import { loginApi } from '@/services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
  login: (email: string, password: string, remember: boolean) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const [user, setUser] = useState<{ email: string; name: string } | null>(() => {
    const stored = localStorage.getItem('logistics_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string, _remember: boolean) => {
    const { data } = await loginApi(email, password);
    const token = data.token ?? data.data?.token;
    if (!token) throw new Error(data.message ?? 'Login failed');
    const loggedInUser = { email, name: data.data?.name ?? email.split('@')[0] };
    localStorage.setItem('token', token);
    localStorage.setItem('logistics_user', JSON.stringify(loggedInUser));
    setIsAuthenticated(true);
    setUser(loggedInUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('logistics_user');
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
