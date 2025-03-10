"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiUser, FiMail, FiCalendar, FiEdit2, FiClock, 
  FiSettings, FiLogOut, FiAlertCircle
} from 'react-icons/fi';
import { getCurrentUser, isAuthenticated, logout } from '@/app/api/authApi';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'watchlist' | 'history' | 'settings'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  // Kiểm tra trạng thái đăng nhập và lấy thông tin người dùng
  useEffect(() => {
    const checkAuthAndGetUser = async () => {
      try {
        setIsLoading(true);
        
        // Kiểm tra đã đăng nhập chưa
        const isLoggedIn = await isAuthenticated();
        
        if (!isLoggedIn) {
          // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
          router.push('/login');
          return;
        }
        
        // Lấy thông tin người dùng hiện tại
        const userResponse = await getCurrentUser();
        if (userResponse.data && userResponse.data.user) {
          setUserData(userResponse.data.user);
        } else {
          setError('Không thể tải thông tin người dùng');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Đã xảy ra lỗi khi tải thông tin hồ sơ');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndGetUser();
  }, [router]);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      console.error('Error logging out:', err);
      setError('Đã xảy ra lỗi khi đăng xuất');
    }
  };

  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-700 h-32 w-32 mb-4"></div>
          <div className="h-6 bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md">
          <div className="flex items-center text-red-500 mb-4">
            <FiAlertCircle className="mr-2 text-2xl" />
            <h2 className="text-xl font-semibold">Đã xảy ra lỗi</h2>
          </div>
          <p className="text-gray-300">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo nếu không có dữ liệu người dùng
  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 max-w-md">
          <div className="flex items-center text-blue-500 mb-4">
            <FiAlertCircle className="mr-2 text-2xl" />
            <h2 className="text-xl font-semibold">Không tìm thấy dữ liệu</h2>
          </div>
          <p className="text-gray-300">Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // Format date to local string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Hero Section with User Info */}
      <div className="relative mb-12">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl h-64 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-20"></div>
        </div>
        
        <div className="relative pt-16 pb-8 px-6 flex flex-col md:flex-row items-center md:items-end">
          {/* User Avatar */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="mb-6 md:mb-0 md:mr-8"
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-800">
                {userData.avatar ? (
                  <Image 
                    src={userData.avatar} 
                    alt={userData.username || 'User avatar'}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                    <FiUser />
                  </div>
                )}
              </div>
              {userData.role === 'premium' && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                  PREMIUM
                </div>
              )}
            </div>
          </motion.div>
          
          {/* User Info */}
          <motion.div 
            className="text-center md:text-left text-white flex-1"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{userData.username || 'Người dùng'}</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
              <div className="flex items-center justify-center md:justify-start">
                <FiMail className="mr-2" />
                <span>{userData.email}</span>
              </div>
              <div className="hidden md:block text-gray-300">•</div>
              <div className="flex items-center justify-center md:justify-start">
                <FiCalendar className="mr-2" />
                <span>Tham gia từ {userData.createdAt ? formatDate(userData.createdAt) : 'N/A'}</span>
              </div>
            </div>
          </motion.div>
          
          {/* Edit Profile Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 md:mt-0 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg flex items-center transition-colors"
          >
            <FiEdit2 className="mr-2" />
            Chỉnh sửa
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-700 flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'watchlist'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Danh sách xem
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'history'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Lịch sử xem
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'settings'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Cài đặt
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="mb-8">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Thông tin tài khoản</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Tên người dùng</h3>
                <p className="text-white">{userData.username || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Email</h3>
                <p className="text-white">{userData.email || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Ngày tham gia</h3>
                <p className="text-white">{userData.createdAt ? formatDate(userData.createdAt) : 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Loại tài khoản</h3>
                <p className="text-white capitalize">{userData.role || 'Chuẩn'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="mb-8">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Cài đặt tài khoản</h2>
            
            {/* Settings options would go here */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Bảo mật</h3>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors">
                  Đổi mật khẩu
                </button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Tùy chọn email</h3>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="email_notifications" 
                    className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-gray-700 border-gray-600"
                  />
                  <label htmlFor="email_notifications" className="ml-2 text-gray-300">
                    Nhận thông báo qua email
                  </label>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-lg font-medium text-red-500 mb-3">Vùng nguy hiểm</h3>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition-colors flex items-center"
                >
                  <FiLogOut className="mr-2" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Các tab khác có thể được thêm vào sau khi có dữ liệu từ API */}
      {(activeTab === 'watchlist' || activeTab === 'history') && (
        <div className="flex justify-center items-center py-16">
          <div className="text-center max-w-md">
            <div className="text-gray-500 text-6xl mb-4 flex justify-center">
              <FiClock />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'watchlist' ? 'Danh sách xem trống' : 'Lịch sử xem trống'}
            </h2>
            <p className="text-gray-400 mb-6">
              {activeTab === 'watchlist' 
                ? 'Bạn chưa thêm phim nào vào danh sách xem.'
                : 'Bạn chưa xem phim nào gần đây.'}
            </p>
            <Link 
              href="/"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors inline-block"
            >
              Khám phá phim
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}