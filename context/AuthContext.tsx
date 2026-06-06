'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';
import { authApi } from '@/lib/endpoints';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string, role: "student" | "teacher") => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);



  const login = async (email: string, password: string) => {
    try {
      // 第一步：发送 POST /api/v1/auth/login 请求获取 token
      const loginResponse = await authApi.login(email, password);
      const accessToken = loginResponse.data.access_token;
      
      // 保存 token 到状态和 localStorage
      setToken(accessToken);
      localStorage.setItem('token', accessToken);
      
      // 第二步：发送 GET /api/v1/auth/me 请求获取用户信息
      // 在 Header 中添加 Authorization: Bearer {access_token}
      const userResponse = await authApi.getUser();  
      const userData = userResponse.data;
      
      // 保存用户信息到状态和 localStorage
      setUser(userData);
      localStorage.setItem('username', userData.username);
      localStorage.setItem('role', userData.role);
      localStorage.setItem('user_id', userData.id.toString());
      localStorage.setItem('email', userData.email);
      localStorage.setItem('created_at', userData.create_time);

      toast.success('登录成功');
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || '登录失败');
      throw err;
    }
  };

  const register = async (email: string, password: string, username: string, role: 'student' | 'teacher') => {
    try {
      await authApi.register({ email, password, username, role });
      toast.success('注册成功');
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || '注册失败');
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('已退出登录');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
