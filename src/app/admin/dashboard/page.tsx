"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiFilm, FiMessageSquare, FiEye, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function AdminDashboardPage() {
  const { admin } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h1 className="text-2xl font-bold text-gray-800">
          Xin chào, {admin?.username || 'Admin'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Chào mừng bạn đến với trang quản trị. Dưới đây là tổng quan về hệ thống.
        </p>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Tổng người dùng"
          value="1,234"
          icon={<FiUsers className="h-6 w-6" />}
          change="+12%"
          positive={true}
          delay={0.1}
        />
        <StatsCard 
          title="Tổng phim"
          value="567"
          icon={<FiFilm className="h-6 w-6" />}
          change="+7%"
          positive={true}
          delay={0.2}
        />
        <StatsCard 
          title="Lượt xem"
          value="45.2K"
          icon={<FiEye className="h-6 w-6" />}
          change="+24%"
          positive={true}
          delay={0.3}
        />
        <StatsCard 
          title="Bình luận"
          value="892"
          icon={<FiMessageSquare className="h-6 w-6" />}
          change="-3%"
          positive={false}
          delay={0.4}
        />
      </div>

      {/* Recent activity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-lg font-bold text-gray-800 mb-4">Hoạt động gần đây</h2>
        <div className="space-y-4">
          <ActivityItem 
            icon={<FiUsers className="h-5 w-5 text-blue-500" />}
            title="Người dùng mới đăng ký"
            description="user123@example.com"
            time="5 phút trước"
          />
          <ActivityItem 
            icon={<FiFilm className="h-5 w-5 text-green-500" />}
            title="Phim mới được thêm vào"
            description="Avengers: Endgame"
            time="1 giờ trước"
          />
          <ActivityItem 
            icon={<FiMessageSquare className="h-5 w-5 text-yellow-500" />}
            title="Bình luận mới"
            description="Phim này thật tuyệt vời!"
            time="3 giờ trước"
          />
          <ActivityItem 
            icon={<FiAlertCircle className="h-5 w-5 text-red-500" />}
            title="Báo cáo vi phạm"
            description="Bình luận chứa nội dung không phù hợp"
            time="5 giờ trước"
          />
        </div>
      </motion.div>
    </div>
  );
}

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  positive: boolean;
  delay: number;
}

const StatsCard = ({ title, value, icon, change, positive, delay }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-100 rounded-lg">
          {icon}
        </div>
        <div className={`flex items-center ${positive ? 'text-green-500' : 'text-red-500'}`}>
          <FiTrendingUp className={`h-4 w-4 mr-1 ${!positive && 'transform rotate-180'}`} />
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </motion.div>
  );
};

// Activity Item Component
interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}

const ActivityItem = ({ icon, title, description, time }: ActivityItemProps) => {
  return (
    <div className="flex items-start">
      <div className="p-2 bg-gray-100 rounded-lg mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="text-xs text-gray-500">{time}</div>
    </div>
  );
};