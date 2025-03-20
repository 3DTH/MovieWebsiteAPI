"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { loginAdmin } from "@/app/api/authApi";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const AdminLoginForm = () => {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      console.log('Đang đăng nhập với email:', email);
      
      // Gọi API đăng nhập admin
      const response = await login({ email, password });
      console.log('Kết quả đăng nhập:', response);

      if (response.data.success) {
        // Chuyển hướng đến trang quản trị
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
      } else {
        setError(response.data.error || "Đăng nhập thất bại");
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      
      if (error.response) {
        if (error.response.status === 404) {
          setError("API endpoint không tồn tại. Vui lòng kiểm tra cấu hình API hoặc đảm bảo server đang chạy.");
        } else if (error.response.status === 401) {
          setError("Tài khoản hoặc mật khẩu không chính xác");
        } else {
          setError(error.response?.data?.error || error.response?.data?.message || "Lỗi xác thực");
        }
      } else if (error.request) {
        setError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.");
      } else {
        setError("Đã xảy ra lỗi khi đăng nhập");
      }
    } finally {
      setIsLoading(false);
    }
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
              placeholder="admin@example.com"
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
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                className="text-gray-500 hover:text-white focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
            isLoading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Đang xử lý...
            </div>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <a
          href="#"
          className="text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          Quên mật khẩu?
        </a>
      </div>
    </motion.div>
  );
};

export default AdminLoginForm;