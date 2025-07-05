import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';

interface User {
  id: number;
  user_id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'student' | 'faculty' | 'admission_agent' | 'finance';
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (userId: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('nscu_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (userId: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login(userId, password);
      
      if (response.token && response.user) {
        const userData: User = {
          id: response.user.id,
          user_id: response.user.user_id,
          email: response.user.email,
          full_name: response.user.full_name,
          role: response.user.role,
          is_active: response.user.is_active
        };
        
        setUser(userData);
        localStorage.setItem('nscu_user', JSON.stringify(userData));
        localStorage.setItem('nscu_token', response.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nscu_user');
    localStorage.removeItem('nscu_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};