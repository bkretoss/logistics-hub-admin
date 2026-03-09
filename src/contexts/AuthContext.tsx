import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
  login: (email: string, password: string, remember: boolean) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('logistics_auth') === 'true';
  });
  const [user, setUser] = useState<{ email: string; name: string } | null>(() => {
    const stored = localStorage.getItem('logistics_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, _password: string, remember: boolean) => {
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockUser = { email, name: email.split('@')[0] };
    setIsAuthenticated(true);
    setUser(mockUser);
    if (remember) {
      localStorage.setItem('logistics_auth', 'true');
      localStorage.setItem('logistics_user', JSON.stringify(mockUser));
    }
    return true;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('logistics_auth');
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
