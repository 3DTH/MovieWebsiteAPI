"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { 
  FiHome, FiFilm, FiUsers, FiSettings, 
  FiLogOut, FiMenu, FiX, FiTv, FiStar, 
  FiMessageSquare, FiBarChart2, FiTag
} from 'react-icons/fi';

interface AdminSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAdminAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      // Clear any local storage data
      localStorage.removeItem('adminToken');
      
      // Redirect to login page
      router.push('/admin/login');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      // You might want to show an error notification here
    }
  };

  const menuItems = [
    { name: 'Manage Users', icon: <FiUsers />, path: '/admin/manage-users' },
    { name: 'Movies', icon: <FiFilm />, path: '/admin/movies' }
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-30 bg-gray-900 text-white transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {isOpen ? (
          <h1 className="text-xl font-bold">Admin Panel</h1>
        ) : (
          <span className="mx-auto text-xl font-bold">AP</span>
        )}
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Admin Info */}
      <div className={`p-4 border-b border-gray-800 ${isOpen ? 'flex items-center' : 'text-center'}`}>
        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
          {admin?.username?.charAt(0).toUpperCase() || 'A'}
        </div>
        {isOpen && (
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium truncate">{admin?.username || 'Admin'}</p>
            <p className="text-xs text-gray-400 truncate">{admin?.email || 'admin@example.com'}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <div
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button - Updated with loading state and better styling */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full px-4 py-3 rounded-md text-gray-400 hover:bg-red-600/10 hover:text-red-500 transition-colors ${
            isOpen ? '' : 'justify-center'
          }`}
        >
          <FiLogOut className="text-xl" />
          {isOpen && <span className="ml-3">Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;