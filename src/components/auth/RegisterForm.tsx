"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { getGoogleLoginUrl, getFacebookLoginUrl, handleSocialLogin } from '@/app/api/authApi';
import { useAuth } from '@/contexts/AuthContext';

const RegisterForm = () => {
  const router = useRouter();
  const { register, isLoading: authLoading, refreshUserData } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Xử lý đăng nhập từ mạng xã hội (Google/Facebook)
  useEffect(() => {
    const processSocialLogin = async () => {
      try {
        // Sử dụng handleSocialLogin đã được cập nhật
        const success = handleSocialLogin();
        
        if (success) {
          setIsLoading(true);
          
          // Cập nhật thông tin người dùng
          await refreshUserData();
          
          // Chuyển hướng về trang chủ
          router.push('/');
        }
      } catch (error) {
        console.error('Lỗi khi xử lý đăng nhập mạng xã hội:', error);
        setError('Đã xảy ra lỗi khi xử lý đăng nhập từ mạng xã hội');
        setIsLoading(false);
      }
    };
    
    processSocialLogin();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep1 = () => {
    if (!formData.username.trim()) {
      setError('Vui lòng nhập tên người dùng');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      
      // Sử dụng hàm register từ AuthContext
      const response = await register(userData);
      
      if (response.data.success) {
        // Đợi một chút để AuthContext có thời gian cập nhật state
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        // Hiển thị thông báo lỗi rõ ràng hơn
        let errorMessage = response.data.message || 'Đăng ký thất bại';
        
        // Kiểm tra thông điệp lỗi cụ thể
        if (errorMessage.toLowerCase().includes('username') && errorMessage.toLowerCase().includes('exists')) {
          errorMessage = 'Tên người dùng này đã tồn tại, vui lòng chọn tên khác';
        } else if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('exists')) {
          errorMessage = 'Email này đã được đăng ký, vui lòng sử dụng email khác';
        }
        
        setError(errorMessage);
      }
    } catch (error: any) {
      console.error('Register error:', error);
      
      // Xem cấu trúc đầy đủ của dữ liệu lỗi
      if (error.response && error.response.data) {
        console.log('Error response data:', error.response.data);
      }
      
      // Xử lý các lỗi từ API response
      let errorMessage = 'Đã xảy ra lỗi khi đăng ký';
      
      if (error.response) {
        // Xử lý thông báo lỗi từ server
        const responseData = error.response.data;
        
        if (responseData) {
          // Kiểm tra các cấu trúc lỗi có thể có
          if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.error) {
            errorMessage = responseData.error;
          } else if (typeof responseData === 'string') {
            errorMessage = responseData;
          }
          
          // Kiểm tra thông điệp lỗi cụ thể
          if (errorMessage.toLowerCase().includes('username') && 
              (errorMessage.toLowerCase().includes('exists') || errorMessage.toLowerCase().includes('taken'))) {
            errorMessage = 'Tên người dùng này đã tồn tại, vui lòng chọn tên khác';
          } else if (errorMessage.toLowerCase().includes('email') && 
                    (errorMessage.toLowerCase().includes('exists') || errorMessage.toLowerCase().includes('taken'))) {
            errorMessage = 'Email này đã được đăng ký, vui lòng sử dụng email khác';
          } else if (error.response.status === 400) {
            // Nếu không có thông báo cụ thể từ server nhưng status là 400
            errorMessage = 'Thông tin đăng ký không hợp lệ, có thể username hoặc email đã tồn tại';
          } else if (error.response.status === 500) {
            errorMessage = 'Lỗi máy chủ, vui lòng thử lại sau';
          }
        }
      } else if (error.request) {
        // Lỗi không nhận được phản hồi từ server
        errorMessage = 'Không thể kết nối đến máy chủ, vui lòng kiểm tra kết nối của bạn';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // Chuyển hướng đến URL đăng nhập Google
    window.location.href = getGoogleLoginUrl();
  };

  const handleFacebookRegister = () => {
    // Chuyển hướng đến URL đăng nhập Facebook
    window.location.href = getFacebookLoginUrl();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {error && (
        <motion.div 
          className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center text-red-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FiAlertCircle className="mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2" htmlFor="username">
                Tên người dùng
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-500" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="w-full pl-10 pr-3 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full pl-10 pr-3 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleNextStep}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Tiếp tục
            </motion.button>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-500">Hoặc đăng ký với</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-700 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                  onClick={handleGoogleRegister}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                >
                  <FaGoogle className="text-red-500 mr-2" />
                  <span>Google</span>
                </motion.button>
                <motion.button
                  type="button"
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-700 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                  onClick={handleFacebookRegister}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                >
                  <FaFacebookF className="text-blue-600 mr-2" />
                  <span>Facebook</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="step2"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2" htmlFor="password">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-gray-500 hover:text-gray-300" />
                  ) : (
                    <FiEye className="text-gray-500 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2" htmlFor="confirmPassword">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="text-gray-500 hover:text-gray-300" />
                  ) : (
                    <FiEye className="text-gray-500 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex space-x-3 mb-6">
              <motion.button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center justify-center w-1/3 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiArrowLeft className="mr-2" />
                Quay lại
              </motion.button>
              
              <motion.button
                type="submit"
                className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex justify-center items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || authLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
              </motion.button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Bằng cách đăng ký, bạn đồng ý với{' '}
              <a href="#" className="text-blue-500 hover:underline">Điều khoản dịch vụ</a>{' '}
              và{' '}
              <a href="#" className="text-blue-500 hover:underline">Chính sách bảo mật</a>{' '}
              của chúng tôi.
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RegisterForm;