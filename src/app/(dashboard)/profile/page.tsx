"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiUser, FiMail, FiCalendar, FiEdit2, FiClock, FiHeart, 
  FiBookmark, FiSettings, FiLogOut, FiEye, FiBarChart2,
  FiFilm, FiTv, FiAward, FiTrendingUp
} from 'react-icons/fi';

// Sample user data - replace with actual user data from your authentication system
const userData = {
  id: 'user123',
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  avatar: '/images/avatar-placeholder.jpg',
  joinDate: '2023-01-15',
  premium: true,
  watchTime: 1250, // in minutes
  favoriteGenres: ['Hành động', 'Khoa học viễn tưởng', 'Phiêu lưu'],
  watchlist: 24,
  favorites: 18,
  reviews: 7,
  recentActivity: [
    { type: 'watched', title: 'Inception', date: '2023-06-10', image: '/images/placeholder-1.jpg' },
    { type: 'rated', title: 'The Dark Knight', rating: 4.5, date: '2023-06-08', image: '/images/placeholder-2.jpg' },
    { type: 'added', title: 'Interstellar', listType: 'watchlist', date: '2023-06-05', image: '/images/placeholder-3.jpg' },
    { type: 'reviewed', title: 'Oppenheimer', date: '2023-06-01', image: '/images/placeholder-4.jpg' },
  ],
  recommendations: [
    { id: 'rec1', title: 'Dune', poster: '/images/placeholder-5.jpg', match: 95 },
    { id: 'rec2', title: 'Blade Runner 2049', poster: '/images/placeholder-1.jpg', match: 92 },
    { id: 'rec3', title: 'The Matrix', poster: '/images/placeholder-2.jpg', match: 88 },
    { id: 'rec4', title: 'Avatar', poster: '/images/placeholder-3.jpg', match: 85 },
  ],
  watchHistory: [
    { id: 'wh1', title: 'Inception', poster: '/images/placeholder-1.jpg', progress: 100, date: '2023-06-10' },
    { id: 'wh2', title: 'The Dark Knight', poster: '/images/placeholder-2.jpg', progress: 100, date: '2023-06-08' },
    { id: 'wh3', title: 'Interstellar', poster: '/images/placeholder-3.jpg', progress: 75, date: '2023-06-05' },
    { id: 'wh4', title: 'Oppenheimer', poster: '/images/placeholder-4.jpg', progress: 100, date: '2023-06-01' },
    { id: 'wh5', title: 'Tenet', poster: '/images/placeholder-5.jpg', progress: 30, date: '2023-05-28' },
  ]
};

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
  const [activeTab, setActiveTab] = useState<'overview' | 'watchlist' | 'history' | 'settings'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Format minutes to hours and minutes
  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

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
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image 
                  src={userData.avatar} 
                  alt={userData.name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              {userData.premium && (
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{userData.name}</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
              <div className="flex items-center justify-center md:justify-start">
                <FiMail className="mr-2" />
                <span>{userData.email}</span>
              </div>
              <div className="hidden md:block text-gray-300">•</div>
              <div className="flex items-center justify-center md:justify-start">
                <FiCalendar className="mr-2" />
                <span>Tham gia từ {new Date(userData.joinDate).toLocaleDateString('vi-VN')}</span>
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
        
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 -mt-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-700"
          >
            <div className="flex items-center mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
                <FiClock className="text-blue-400" size={20} />
              </div>
              <span className="text-gray-400 text-sm">Thời gian xem</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatWatchTime(userData.watchTime)}</p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-700"
          >
            <div className="flex items-center mb-2">
              <div className="p-2 bg-red-500/20 rounded-lg mr-3">
                <FiHeart className="text-red-400" size={20} />
              </div>
              <span className="text-gray-400 text-sm">Yêu thích</span>
            </div>
            <p className="text-2xl font-bold text-white">{userData.favorites}</p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-700"
          >
            <div className="flex items-center mb-2">
              <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
                <FiBookmark className="text-purple-400" size={20} />
              </div>
              <span className="text-gray-400 text-sm">Danh sách xem</span>
            </div>
            <p className="text-2xl font-bold text-white">{userData.watchlist}</p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-700"
          >
            <div className="flex items-center mb-2">
              <div className="p-2 bg-green-500/20 rounded-lg mr-3">
                <FiAward className="text-green-400" size={20} />
              </div>
              <span className="text-gray-400 text-sm">Đánh giá</span>
            </div>
            <p className="text-2xl font-bold text-white">{userData.reviews}</p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="mb-8 border-b border-gray-700">
        <div className="flex overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'text-white border-b-2 border-red-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
              activeTab === 'watchlist' 
                ? 'text-white border-b-2 border-red-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Danh sách xem
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
              activeTab === 'history' 
                ? 'text-white border-b-2 border-red-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Lịch sử xem
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'text-white border-b-2 border-red-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Cài đặt
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="mb-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column - Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FiBarChart2 className="mr-2" />
                  Hoạt động gần đây
                </h2>
                
                <div className="space-y-4">
                  {userData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div className="w-12 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                        <Image 
                          src={activity.image} 
                          alt={activity.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-white">{activity.title}</h3>
                          <span className="text-xs text-gray-400">{activity.date}</span>
                        </div>
                        <p className="text-sm text-gray-400">
                          {activity.type === 'watched' && 'Đã xem'}
                          {activity.type === 'rated' && `Đã đánh giá ${activity.rating}/5`}
                          {activity.type === 'added' && `Đã thêm vào ${activity.listType === 'watchlist' ? 'danh sách xem' : 'yêu thích'}`}
                          {activity.type === 'reviewed' && 'Đã viết đánh giá'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Recommendations */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FiTrendingUp className="mr-2" />
                  Đề xuất cho bạn
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {userData.recommendations.map(movie => (
                    <Link href={`/movies/${movie.id}`} key={movie.id}>
                      <div className="group relative rounded-lg overflow-hidden">
                        <div className="aspect-[2/3] relative">
                          <Image 
                            src={movie.poster} 
                            alt={movie.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-sm font-medium text-white truncate">{movie.title}</h3>
                          <div className="flex items-center mt-1">
                            <div className="bg-green-500 text-xs font-bold px-2 py-1 rounded text-white">
                              {movie.match}% phù hợp
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Favorite Genres & Stats */}
            <div>
              {/* Favorite Genres */}
              <div className="bg-gray-800 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FiFilm className="mr-2" />
                  Thể loại yêu thích
                </h2>
                
                <div className="space-y-4">
                  {userData.favoriteGenres.map((genre, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-full bg-gray-700 rounded-full h-4 mr-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full" 
                          style={{ width: `${100 - index * 15}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm whitespace-nowrap">{genre}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Viewing Stats */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FiEye className="mr-2" />
                  Thống kê xem
                </h2>
                
                <div className="space-y-6">
                  {/* Weekly viewing chart */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Thời gian xem theo tuần</h3>
                    <div className="h-24 flex items-end space-x-2">
                      {Array.from({ length: 7 }).map((_, i) => {
                        const height = Math.floor(Math.random() * 70) + 30;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-sm" 
                              style={{ height: `${height}%` }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-1">
                              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][i]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Device usage */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Thiết bị sử dụng</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Smart TV</span>
                          <span className="text-white">45%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Mobile</span>
                          <span className="text-white">30%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Desktop</span>
                          <span className="text-white">25%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Watchlist Tab */}
        {activeTab === 'watchlist' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {userData.watchHistory.map(movie => (
                <div key={movie.id} className="group relative">
                  <Link href={`/movies/${movie.id}`}>
                    <div className="aspect-[2/3] relative rounded-lg overflow-hidden">
                      <Image 
                        src={movie.poster} 
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-sm font-medium text-white truncate">{movie.title}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-300">{new Date(movie.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <button className="absolute top-2 right-2 p-1.5 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiBookmark size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* History Tab */}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              {userData.watchHistory.map(movie => (
                <div key={movie.id} className="bg-gray-800 rounded-lg p-4 flex items-center">
                  <div className="w-16 h-24 relative rounded overflow-hidden flex-shrink-0">
                    <Image 
                      src={movie.poster} 
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <Link href={`/movies/${movie.id}`} className="hover:text-red-500 transition-colors">
                        <h3 className="font-medium text-white">{movie.title}</h3>
                      </Link>
                      <span className="text-xs text-gray-400">{new Date(movie.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${movie.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${movie.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{movie.progress}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <FiBookmark size={20} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Account Settings */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <FiUser className="mr-2" />
                Thông tin tài khoản
              </h2>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Họ và tên</label>
                  <input 
                    type="text" 
                    defaultValue={userData.name}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input 
                    type="email" 
                    defaultValue={userData.email}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Mật khẩu</label>
                  <input 
                    type="password" 
                    defaultValue="********"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Lưu thay đổi
                </button>
              </form>
            </div>
            
            {/* Preferences */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <FiSettings className="mr-2" />
                Tùy chọn
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Ngôn ngữ</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg">
                      Tiếng Việt
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                      English
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Chế độ hiển thị</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg">
                      Tối
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                      Sáng
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Thông báo</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Thông báo phim mới</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white">Thông báo khuyến mãi</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white">Thông báo bình luận</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Chất lượng phát video</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        id="quality-auto" 
                        type="radio" 
                        name="video-quality" 
                        defaultChecked
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 focus:ring-red-500 focus:ring-2"
                      />
                      <label htmlFor="quality-auto" className="ml-2 text-sm font-medium text-white">
                        Tự động (khuyến nghị)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        id="quality-high" 
                        type="radio" 
                        name="video-quality" 
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 focus:ring-red-500 focus:ring-2"
                      />
                      <label htmlFor="quality-high" className="ml-2 text-sm font-medium text-white">
                        Cao (HD)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        id="quality-medium" 
                        type="radio" 
                        name="video-quality" 
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 focus:ring-red-500 focus:ring-2"
                      />
                      <label htmlFor="quality-medium" className="ml-2 text-sm font-medium text-white">
                        Trung bình (SD)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        id="quality-low" 
                        type="radio" 
                        name="video-quality" 
                        className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 focus:ring-red-500 focus:ring-2"
                      />
                      <label htmlFor="quality-low" className="ml-2 text-sm font-medium text-white">
                        Thấp (tiết kiệm dữ liệu)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Subscription & Logout */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <h2 className="text-xl font-bold text-white mb-2 relative z-10">Nâng cấp tài khoản Premium</h2>
                <p className="text-white/80 mb-6 relative z-10">Trải nghiệm không giới hạn với chất lượng cao nhất</p>
                
                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex items-center">
                    <div className="p-1 bg-white/20 rounded-full mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-white text-sm">Xem phim chất lượng 4K</span>
                  </div>
                  <div className="flex items-center">
                    <div className="p-1 bg-white/20 rounded-full mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-white text-sm">Không quảng cáo</span>
                  </div>
                  <div className="flex items-center">
                    <div className="p-1 bg-white/20 rounded-full mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-white text-sm">Tải xuống để xem offline</span>
                  </div>
                </div>
                
                <button className="w-full bg-white hover:bg-white/90 text-blue-900 font-medium py-2 px-4 rounded-lg transition-colors relative z-10">
                  {userData.premium ? 'Gia hạn gói Premium' : 'Nâng cấp ngay'}
                </button>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <FiSettings className="mr-2" />
                    Tùy chọn nâng cao
                  </h2>
                  
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                      <span className="text-white">Quản lý thiết bị</span>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                    
                    <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                      <span className="text-white">Lịch sử thanh toán</span>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                    
                    <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                      <span className="text-white">Trợ giúp & Hỗ trợ</span>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <button className="mt-6 w-full flex items-center justify-center px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded-lg transition-colors">
                  <FiLogOut className="mr-2" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}