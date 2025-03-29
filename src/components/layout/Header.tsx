"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiBell, FiLogIn, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Navigation items
  const navItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Danh sách phim', path: '/movies' },
    // { name: 'Phim bộ', path: '/movies?filter=series' },
    // { name: 'Phim lẻ', path: '/movies?filter=single' },
    { name: 'Diễn viên', path: '/actors' },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image 
                src="/logo.svg" 
                alt="3DFlix Logo" 
                width={140} 
                height={40} 
                className="h-8 w-auto sm:h-10"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path}
                className={`text-base font-medium transition-colors duration-200 hover:text-red-500 ${
                  pathname === item.path ? 'text-red-500' : 'text-gray-200'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">

            {isAuthenticated ? (
              <>
                {/* User Menu - Hiển thị khi đã đăng nhập */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <Link href="/profile" className="text-gray-200 hover:text-red-500 transition-colors flex items-center">
                    {user && user.avatar ? (
                      <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-300">
                        <Image 
                          src={user.avatar} 
                          alt={user.username || 'User avatar'}
                          width={32}
                          height={32}
                          className="object-cover h-full w-full"
                        />
                      </div>
                    ) : (
                      <FiUser className="h-5 w-5" />
                    )}
                    {user && <span className="ml-2 text-sm font-semibold">{user.username}</span>}
                  </Link>
                </motion.div>

                {/* Notifications - Hiển thị khi đã đăng nhập */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <button className="text-gray-200 hover:text-red-500 transition-colors">
                    <FiBell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></span>
                  </button>
                </motion.div>

                {/* Logout Button - Hiển thị khi đã đăng nhập */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button 
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    <FiLogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </button>
                </motion.div>
              </>
            ) : (
              /* Login/Register Button - Hiển thị khi chưa đăng nhập */
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/login" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  <FiLogIn className="mr-2 h-4 w-4" />
                  Đăng nhập
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-200 hover:text-red-500 transition-colors"
              aria-label="Open menu"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`block py-2 text-base font-medium transition-colors duration-200 hover:text-red-500 ${
                    pathname === item.path ? 'text-red-500' : 'text-gray-200'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-700">
               
                {isAuthenticated ? (
                  <>
                    {/* Hiển thị khi đã đăng nhập */}
                    <Link
                      href="/profile"
                      className="flex items-center py-2 text-base font-medium text-gray-200 hover:text-red-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {user && user.avatar ? (
                        <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-300">
                          <Image 
                            src={user.avatar} 
                            alt={user.username || 'User avatar'}
                            width={32}
                            height={32}
                            className="object-cover h-full w-full"
                          />
                        </div>
                      ) : (
                        <FiUser className="mr-3 h-5 w-5" />
                      )}
                      {user && <span className="ml-2 text-sm font-semibold">{user.username}</span>}
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center py-2 text-base font-medium text-gray-200 hover:text-red-500"
                    >
                      <FiLogOut className="mr-3 h-5 w-5" />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  /* Hiển thị khi chưa đăng nhập */
                  <Link
                    href="/login"
                    className="flex items-center py-2 text-base font-medium text-gray-200 hover:text-red-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiLogIn className="mr-3 h-5 w-5" />
                    Đăng nhập
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;