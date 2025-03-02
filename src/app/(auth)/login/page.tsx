"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <motion.div 
        className="w-full max-w-4xl flex rounded-xl overflow-hidden shadow-2xl bg-gray-900"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left side - Form */}
        <motion.div 
          className="w-full md:w-1/2 p-8 md:p-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Chào mừng trở lại</h1>
            <p className="text-gray-400">Đăng nhập để tiếp tục trải nghiệm</p>
          </motion.div>

          <LoginForm />

          <motion.div variants={itemVariants} className="mt-8">
            <p className="text-center text-gray-500 text-sm">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-red-500 hover:text-red-400 transition-colors">
                Đăng ký ngay
              </Link>
            </p>
          </motion.div>
        </motion.div>
        {/* Right side - Image and info */}
        <div className="hidden md:block md:w-1/2 relative bg-gradient-to-br from-gray-900 to-black overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 to-purple-700/40"></div>
            
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-red-500/20 blur-3xl"></div>
            <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-purple-600/30 blur-3xl"></div>
            <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-pink-500/20 blur-3xl"></div>
            
            {/* Animated particles */}
            <div className="absolute top-20 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
            
            {/* Decorative shapes */}
            <div className="absolute top-1/4 right-1/4 w-12 h-12 border border-red-300/30 rounded-full"></div>
            <div className="absolute bottom-1/3 left-1/4 w-8 h-8 border border-purple-300/30 rotate-45 transform"></div>
            <div className="absolute top-2/3 right-1/3 w-16 h-16 border-2 border-pink-300/20 rounded-full"></div>
            
            {/* Light beams */}
            <div className="absolute top-0 left-1/2 w-1 h-40 bg-gradient-to-b from-red-500/40 to-transparent transform -rotate-45"></div>
            <div className="absolute bottom-0 right-1/3 w-1 h-40 bg-gradient-to-t from-purple-500/40 to-transparent transform rotate-45"></div>
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-center items-center p-12 z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-4">Khám phá thế giới phim ảnh</h2>
              <p className="text-gray-200 mb-6">
                Hàng ngàn bộ phim và series đang chờ bạn khám phá. Đăng nhập để bắt đầu cuộc phiêu lưu của bạn.
              </p>
              <div className="flex justify-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-3 h-3 bg-red-500 rounded-full"
                ></motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-3 h-3 bg-white rounded-full"
                ></motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-3 h-3 bg-white rounded-full"
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}