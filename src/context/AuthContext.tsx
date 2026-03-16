/**
 * Auth Context
 * Manages authentication state and JWT token
 */

import React, { createContext, useState, useCallback, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    // Load token from localStorage on mount
    return localStorage.getItem('authToken');
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user from token on mount
  useEffect(() => {
    if (token) {
      // Decode token to get user info (basic JWT decode)
      try {
        const payload = JSON.parse(
          atob(token.split('.')[1])
        );
        setUser({
          id: payload.sub,
          email: payload.email,
          role: payload.role,
        });
      } catch (err) {
        // Invalid token
        localStorage.removeItem('authToken');
        setToken(null);
      }
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const newToken = data.data.token;
      const newUser = data.data.user;

      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('authToken', newToken);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
