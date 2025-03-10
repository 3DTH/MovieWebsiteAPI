"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { getGoogleLoginUrl, getFacebookLoginUrl } from "@/app/api/authApi";
import { useAuth } from "@/contexts/AuthContext";
import { handleSocialLogin } from "@/app/api/authApi";

const LoginForm = () => {
  const router = useRouter();
  const { login, isLoading: authLoading, refreshUserData } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý đăng nhập từ mạng xã hội (Google/Facebook)
  useEffect(() => {
    const processSocialLogin = async () => {
      try {
        // Sử dụng handleSocialLogin đã được cập nhật
        const success = handleSocialLogin();

        if (success) {
          setIsLoading(true);

          await refreshUserData();

          router.push("/");
        }
      } catch (error) {
        console.error("Lỗi khi xử lý đăng nhập mạng xã hội:", error);
        setError("Đã xảy ra lỗi khi xử lý đăng nhập từ mạng xã hội");
        setIsLoading(false);
      }
    };

    processSocialLogin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Kiểm tra form
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      setIsLoading(false);
      return;
    }

    try {
      // Sử dụng login từ AuthContext
      const response = await login({ email, password });

      if (response.data.success) {
        // Đảm bảo trạng thái đăng nhập đã được cập nhật trước khi chuyển trang
        // Đợi một chút để AuthContext có thời gian cập nhật state
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setError(response.data.message || "Đăng nhập thất bại");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Chuyển hướng đến URL đăng nhập Google
    window.location.href = getGoogleLoginUrl();
  };

  const handleFacebookLogin = () => {
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
          <FiAlertCircle className="mr-2" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-500" />
            </div>
            <input
              id="email"
              type="email"
              className="w-full pl-10 pr-3 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-400 text-sm mb-2"
            htmlFor="password"
          >
            Mật khẩu
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-500" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full pl-10 pr-10 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
          <div className="flex justify-end mt-2">
            <a
              href="#"
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Quên mật khẩu?
            </a>
          </div>
        </div>

        <motion.button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors flex justify-center items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading || authLoading}
        >
          {isLoading ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : null}
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </motion.button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-500">
              Hoặc đăng nhập với
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <motion.button
            type="button"
            className="w-full inline-flex justify-center py-3 px-4 border border-gray-700 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            onClick={handleGoogleLogin}
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
            onClick={handleFacebookLogin}
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
  );
};

export default LoginForm;
