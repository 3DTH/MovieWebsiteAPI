"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginAdmin, getCurrentAdmin, logoutAdmin, isAdminAuthenticated, LoginData } from '@/app/api/authApi';

interface AdminAuthContextType {
  admin: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<any>;
  logout: () => void;
  refreshAdminData: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAdminAuthenticated()) {
          await refreshAdminData();
        } else {
          setIsAuthenticated(false);
          setAdmin(null);
        }
      } catch (error) {
        console.error('Error checking admin authentication:', error);
        setIsAuthenticated(false);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Làm mới thông tin admin
  const refreshAdminData = async () => {
    try {
      const response = await getCurrentAdmin();
      if (response.data && response.data.success) {
        setAdmin(response.data.admin);
        setIsAuthenticated(true);
      } else {
        setAdmin(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error refreshing admin data:', error);
      setAdmin(null);
      setIsAuthenticated(false);
    }
  };

  // Đăng nhập
  const login = async (data: LoginData) => {
    try {
      const response = await loginAdmin(data);
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        await refreshAdminData();
      }
      
      return response;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  };

  // Đăng xuất
  const logout = () => {
    logoutAdmin();
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const value = {
    admin,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshAdminData
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};