"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
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
        {/* Left side - Image and info */}
        <div className="hidden md:block md:w-1/2 relative bg-gray-800">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/40 z-10">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"></div>
              <div className="absolute top-1/3 -right-24 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl"></div>
              <div className="absolute -bottom-16 left-1/4 w-60 h-60 rounded-full bg-purple-500/20 blur-3xl"></div>
              
              {/* Animated elements */}
              <div className="absolute top-20 right-20 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-24 right-1/3 w-2 h-2 bg-indigo-300 rounded-full animate-pulse"></div>
              
              {/* Geometric shapes */}
              <div className="absolute top-1/4 left-1/3 w-8 h-8 border border-blue-300/30 rotate-45"></div>
              <div className="absolute bottom-1/3 right-1/4 w-12 h-12 border border-indigo-300/20 rounded-full"></div>
            </div>
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-center items-center p-12 z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-4">Tham gia cùng chúng tôi</h2>
              <p className="text-gray-200 mb-6">
                Đăng ký để lưu phim yêu thích, tạo danh sách xem và nhận thông báo về các phim mới nhất.
              </p>
              <div className="flex justify-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-3 h-3 bg-blue-500 rounded-full"
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

        {/* Right side - Form */}
        <motion.div 
          className="w-full md:w-1/2 p-8 md:p-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Tạo tài khoản mới</h1>
            <p className="text-gray-400">Đăng ký để trải nghiệm đầy đủ tính năng</p>
          </motion.div>

          <RegisterForm />

          <motion.div variants={itemVariants} className="mt-8">
            <p className="text-center text-gray-500 text-sm">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-blue-500 hover:text-blue-400 transition-colors">
                Đăng nhập ngay
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}