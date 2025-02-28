"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail } from 'react-icons/fi';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    company: [
      { name: 'Giới thiệu', href: '/about' },
      { name: 'Liên hệ', href: '/contact' },
      { name: 'Điều khoản sử dụng', href: '/terms' },
      { name: 'Chính sách bảo mật', href: '/privacy' },
    ],
    categories: [
      { name: 'Phim hành động', href: '/genres/action' },
      { name: 'Phim tình cảm', href: '/genres/romance' },
      { name: 'Phim kinh dị', href: '/genres/horror' },
      { name: 'Phim hài', href: '/genres/comedy' },
      { name: 'Phim khoa học viễn tưởng', href: '/genres/sci-fi' },
    ],
    support: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Trung tâm hỗ trợ', href: '/support' },
      { name: 'Báo cáo lỗi', href: '/report-issue' },
      { name: 'Yêu cầu phim', href: '/request-movie' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: <FiFacebook />, href: 'https://facebook.com' },
    { name: 'Twitter', icon: <FiTwitter />, href: 'https://twitter.com' },
    { name: 'Instagram', icon: <FiInstagram />, href: 'https://instagram.com' },
    { name: 'Youtube', icon: <FiYoutube />, href: 'https://youtube.com' },
  ];

  return (
    <footer className="bg-black text-gray-400">
      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Đăng ký nhận thông báo</h3>
              <p className="mb-4">Nhận thông báo về phim mới và ưu đãi đặc biệt</p>
            </div>
            <div>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-grow px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
                >
                  Đăng ký
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo and Description */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block">
                <Image 
                  src="/logo.svg" 
                  alt="3DFlix Logo" 
                  width={140} 
                  height={40} 
                  className="h-8 w-auto"
                />
              </Link>
              <p className="mt-4 text-sm">
                3DFlix là nền tảng xem phim trực tuyến hàng đầu, cung cấp đa dạng các bộ phim từ nhiều thể loại khác nhau. 
                Với giao diện thân thiện và trải nghiệm người dùng tuyệt vời, chúng tôi cam kết mang đến những giây phút giải trí tuyệt vời.
              </p>
              <div className="mt-6 flex space-x-4">
                {socialLinks.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={item.name}
                  >
                    {item.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                Công ty
              </h3>
              <ul className="space-y-2">
                {footerLinks.company.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                Thể loại
              </h3>
              <ul className="space-y-2">
                {footerLinks.categories.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                Hỗ trợ
              </h3>
              <ul className="space-y-2">
                {footerLinks.support.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center text-sm text-red-500 hover:text-red-400"
                >
                  <FiMail className="mr-2" />
                  Liên hệ hỗ trợ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs">
            &copy; {currentYear} 3DFlix. Tất cả các quyền được bảo lưu.
          </p>
          <p className="text-xs mt-2 sm:mt-0">
            Thiết kế và phát triển bởi <span className="text-red-500">DoAnUngDungMoi_S4</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;