"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiBell, FiSearch, FiMenu, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminHeader = () => {
  const router = useRouter();
  const { admin, logout } = useAdminAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left side - Mobile menu toggle */}
        <div className="flex items-center lg:hidden">
          <button 
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => document.dispatchEvent(new CustomEvent('toggle-admin-sidebar'))}
          >
            <FiMenu className="h-6 w-6" />
          </button>
        </div>

        {/* Middle - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Tìm kiếm..."
            />
          </div>
        </div>

        {/* Right side - Notifications & Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              <FiBell className="h-6 w-6" />
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-2 px-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Thông báo</h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <div className="py-3 px-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">Phim mới được thêm vào</p>
                    <p className="text-xs text-gray-500 mt-1">2 phút trước</p>
                  </div>
                  <div className="py-3 px-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">Người dùng mới đăng ký</p>
                    <p className="text-xs text-gray-500 mt-1">1 giờ trước</p>
                  </div>
                </div>
                <div className="py-2 px-4 text-center">
                  <button className="text-sm text-red-600 hover:text-red-800">
                    Xem tất cả thông báo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {admin?.avatar ? (
                  <img src={admin.avatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <FiUser className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {admin?.username || 'Admin'}
              </span>
            </button>

            {/* Profile menu */}
            {showProfileMenu && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => router.push('/admin/profile')}
                  >
                    <FiUser className="mr-3 h-4 w-4" />
                    Hồ sơ
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => router.push('/admin/settings')}
                  >
                    <FiSettings className="mr-3 h-4 w-4" />
                    Cài đặt
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="mr-3 h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;