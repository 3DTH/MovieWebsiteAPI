"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiEdit2,
  FiClock,
  FiSettings,
  FiLogOut,
  FiAlertCircle,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { getCurrentUser, isAuthenticated, logout } from "@/app/api/authApi";
import { updateUsername } from "@/app/api/userApi";
import { updateAvatar, getAvatars, Avatar } from "@/app/api/userApi";
import { getFavoriteMovies } from "@/app/api/favoriteApi";
import { Movie } from "@/app/api/movieApi";

// Define a proper interface for user data
interface User {
  id?: string;
  username?: string;
  email?: string;
  avatar?: string;
  fullName?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "watchlist" | "history" | "settings"
  >("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

  // Username state
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSuccess, setUsernameSuccess] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (activeTab === "watchlist") {
        try {
          setIsLoadingFavorites(true);
          const response = await getFavoriteMovies();
          if (response.success) {
            setFavorites(response.data);
          }
        } catch (error) {
          console.error("Error fetching favorites:", error);
          setError("Không thể tải danh sách phim yêu thích");
        } finally {
          setIsLoadingFavorites(false);
        }
      }
    };

    fetchFavorites();
  }, [activeTab]);

  // Kiểm tra trạng thái đăng nhập và lấy thông tin người dùng
  useEffect(() => {
    const checkAuthAndGetUser = async () => {
      try {
        setIsLoading(true);

        // Kiểm tra đã đăng nhập chưa
        const isLoggedIn = await isAuthenticated();

        if (!isLoggedIn) {
          // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
          router.push("/login");
          return;
        }

        // Lấy thông tin người dùng hiện tại
        const userResponse = await getCurrentUser();
        if (userResponse.data && userResponse.data.user) {
          setUserData(userResponse.data.user);
          setSelectedAvatar(userResponse.data.user.avatar || null);
        } else {
          setError("Không thể tải thông tin người dùng");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Đã xảy ra lỗi khi tải thông tin hồ sơ");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndGetUser();
  }, [router]);

  // Lấy danh sách avatars
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        setIsLoadingAvatars(true);
        const response = await getAvatars();
        if (response.success && response.data) {
          setAvatars(response.data);
        }
      } catch (error) {
        console.error("Error fetching avatars:", error);
      } finally {
        setIsLoadingAvatars(false);
      }
    };

    // Nếu người dùng mở modal chọn avatar thì mới fetch
    if (showAvatarModal) {
      fetchAvatars();
    }
  }, [showAvatarModal]);

  // Tạo danh sách avatar mặc định nếu API không trả về
  useEffect(() => {
    if (showAvatarModal && avatars.length === 0 && !isLoadingAvatars) {
      // Create default avatars (1-12)
      const defaultAvatars = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        path: `/avatars/avatar-${i + 1}.png`,
      }));
      setAvatars(defaultAvatars);
    }
  }, [showAvatarModal, avatars, isLoadingAvatars]);

  // Xử lý cập nhật avatar
  const handleUpdateAvatar = async (avatarPath: string) => {
    try {
      setIsUpdatingAvatar(true);
      setUpdateSuccess(false);

      const response = await updateAvatar(avatarPath);

      if (response.success && response.data) {
        // Cập nhật userData với avatar mới
        setUserData((prev: User | null) => ({
          ...prev,
          avatar: avatarPath,
        }));
        setSelectedAvatar(avatarPath);
        setUpdateSuccess(true);

        // Đóng modal sau 1 giây
        setTimeout(() => {
          setShowAvatarModal(false);
          setUpdateSuccess(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      setError("Không thể cập nhật avatar, vui lòng thử lại sau");
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  // Xử lý cập nhật username
  const handleUpdateUsername = async () => {
    // Reset states
    setUsernameError(null);
    setUsernameSuccess(false);

    // Validate
    if (!newUsername || newUsername.trim().length < 3) {
      setUsernameError("Username phải có ít nhất 3 ký tự");
      return;
    }

    // Don't update if username is the same
    if (newUsername === userData?.username) {
      setShowUsernameModal(false);
      return;
    }

    setIsUpdatingUsername(true);

    try {
      const response = await updateUsername(newUsername);

      if (response.success) {
        // Update local state
        setUserData((prev: User | null) => ({
          ...prev,
          username: newUsername,
        }));
        setUsernameSuccess(true);

        // Hide modal after 1.5 seconds
        setTimeout(() => {
          setShowUsernameModal(false);
          setUsernameSuccess(false);
        }, 1500);
      }
    } catch (error: any) {
      setUsernameError(error.message || "Không thể cập nhật username");
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Error logging out:", err);
      setError("Đã xảy ra lỗi khi đăng xuất");
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
            onClick={() => router.push("/")}
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
          <p className="text-gray-300">
            Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.
          </p>
          <button
            onClick={() => router.push("/login")}
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
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Hero Section with User Info */}
      <div className="relative mb-12">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-800 to-black rounded-xl h-64 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-20"></div>
        </div>

        <div className="relative pt-16 pb-8 px-6 flex flex-col md:flex-row items-center md:items-end">
          {/* User Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mb-6 md:mb-0 md:mr-8"
          >
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-800">
                {userData.avatar ? (
                  <Image
                    src={userData.avatar}
                    alt={userData.username || "User avatar"}
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

              {/* Edit avatar button */}
              <button
                onClick={() => setShowAvatarModal(true)}
                className="absolute bottom-0 right-0 p-2 bg-red-600 rounded-full text-white shadow-lg transition-transform transform scale-0 group-hover:scale-100 hover:bg-red-700"
                title="Thay đổi avatar"
              >
                <FiEdit2 size={18} />
              </button>
            </div>
          </motion.div>

          {/* User Info */}
          <motion.div
            className="text-center md:text-left text-white flex-1"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {userData.username || "Người dùng"}
            </h1>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
              <div className="flex items-center justify-center md:justify-start">
                <FiMail className="mr-2" />
                <span>{userData.email}</span>
              </div>
              <div className="hidden md:block text-gray-300">•</div>
              <div className="flex items-center justify-center md:justify-start">
                <FiCalendar className="mr-2" />
                <span>
                  Tham gia từ{" "}
                  {userData.createdAt ? formatDate(userData.createdAt) : "N/A"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Edit Profile Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 md:mt-0 px-4 text-white py-2 bg-red-900/30 hover:bg-red-900/50 backdrop-blur-sm rounded-lg flex items-center transition-colors"
            onClick={() => setShowUsernameModal(true)}
          >
            <FiEdit2 className="mr-2" />
            Chỉnh sửa
          </motion.button>
        </div>
      </div>

      {/* Modal chọn avatar */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 relative"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Chọn avatar</h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>

            {isLoadingAvatars ? (
              <div className="flex justify-center py-8">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                {avatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handleUpdateAvatar(avatar.path)}
                    disabled={isUpdatingAvatar}
                    className={`relative p-1 rounded-full overflow-hidden transition-all ${
                      selectedAvatar === avatar.path
                        ? "ring-2 ring-red-600 ring-offset-1 ring-offset-gray-900"
                        : "hover:ring-2 hover:ring-gray-600 hover:ring-offset-1 hover:ring-offset-gray-900"
                    }`}
                  >
                    <div className="relative w-full pb-[100%]">
                      <Image
                        src={avatar.path}
                        alt={`Avatar ${avatar.id}`}
                        fill
                        className="object-cover rounded-full"
                      />

                      {/* Selected indicator */}
                      {selectedAvatar === avatar.path && (
                        <div className="absolute inset-0 flex items-center justify-center bg-opacity-40">
                          <FiCheck className="text-red-500 text-xl" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Success message */}
            {updateSuccess && (
              <div className="mt-4 p-2 bg-green-500 bg-opacity-10 border border-green-500 rounded-lg text-green-400 flex items-center">
                <FiCheck className="mr-2" /> Avatar đã được cập nhật thành công!
              </div>
            )}

            {/* Error message */}
            {error && error.includes("avatar") && (
              <div className="mt-4 p-2 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal cập nhật username */}
      {showUsernameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 relative"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                Cập nhật tên người dùng
              </h3>
              <button
                onClick={() => setShowUsernameModal(false)}
                className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Tên người dùng mới
              </label>
              <input
                type="text"
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder={userData?.username || "Nhập tên người dùng mới"}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={isUpdatingUsername}
              />
              {usernameError && (
                <p className="mt-2 text-sm text-red-500">{usernameError}</p>
              )}
            </div>

            {/* Success message */}
            {usernameSuccess && (
              <div className="mt-4 p-2 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-400 flex items-center">
                <FiCheck className="mr-2" /> Tên người dùng đã được cập nhật
                thành công!
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowUsernameModal(false)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                disabled={isUpdatingUsername}
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateUsername}
                disabled={
                  isUpdatingUsername || !newUsername || newUsername.length < 3
                }
                className={`px-4 py-2 rounded-lg text-white flex items-center ${
                  isUpdatingUsername || !newUsername || newUsername.length < 3
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isUpdatingUsername ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-700 flex overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "overview"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "watchlist"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Danh sách xem
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "history"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Lịch sử xem
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "settings"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Cài đặt
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="mb-8 space-y-6">
          {/* Hoạt động gần đây */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FiClock className="mr-2 text-red-500" /> Hoạt động gần đây
            </h2>

            <div className="space-y-4">
              {/* Placeholder for recent activities */}
              <div className="p-4 bg-gray-900/80 rounded-lg border border-gray-700 flex items-center">
                <div className="w-12 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0">
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-2xl">🎬</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">
                    Đã xem <span className="text-red-500">Inception</span>
                  </p>
                  <p className="text-gray-400 text-sm">3 giờ trước</p>
                </div>
              </div>

              <div className="p-4 bg-gray-900/80 rounded-lg border border-gray-700 flex items-center">
                <div className="w-12 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0">
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">
                    Đã đánh giá{" "}
                    <span className="text-red-500">The Dark Knight</span>
                  </p>
                  <p className="text-gray-400 text-sm">Hôm qua</p>
                </div>
              </div>

              <div className="p-4 bg-gray-900/80 rounded-lg border border-gray-700 flex items-center">
                <div className="w-12 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0">
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-2xl">📌</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">
                    Đã thêm <span className="text-red-500">The Godfather</span>{" "}
                    vào danh sách xem
                  </p>
                  <p className="text-gray-400 text-sm">3 ngày trước</p>
                </div>
              </div>
            </div>
          </div>

          {/* Thống kê phim */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FiUser className="mr-2 text-red-500" /> Thống kê phim
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/80 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-gray-400 text-sm mb-1">Đã xem</h3>
                  <p className="text-white text-2xl font-bold">24</p>
                </div>

                <div className="bg-gray-900/80 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-gray-400 text-sm mb-1">Đã đánh giá</h3>
                  <p className="text-white text-2xl font-bold">18</p>
                </div>

                <div className="bg-gray-900/80 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-gray-400 text-sm mb-1">Danh sách xem</h3>
                  <p className="text-white text-2xl font-bold">7</p>
                </div>

                <div className="bg-gray-900/80 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-gray-400 text-sm mb-1">Yêu thích</h3>
                  <p className="text-white text-2xl font-bold">12</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FiSettings className="mr-2 text-red-500" /> Thể loại yêu thích
              </h2>

              <div className="space-y-3">
                <div className="relative pt-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-white">Hành động</span>
                    <span className="text-gray-400 text-sm">42%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-600 to-red-400 h-2 rounded-full"
                      style={{ width: "42%" }}
                    ></div>
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-white">Khoa học viễn tưởng</span>
                    <span className="text-gray-400 text-sm">28%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-600 to-red-400 h-2 rounded-full"
                      style={{ width: "28%" }}
                    ></div>
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-white">Kinh dị</span>
                    <span className="text-gray-400 text-sm">15%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-600 to-red-400 h-2 rounded-full"
                      style={{ width: "15%" }}
                    ></div>
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-white">Lãng mạn</span>
                    <span className="text-gray-400 text-sm">10%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-600 to-red-400 h-2 rounded-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="mb-8">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">
              Cài đặt tài khoản
            </h2>

            {/* Settings options would go here */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Bảo mật</h3>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors">
                  Đổi mật khẩu
                </button>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-3">
                  Tùy chọn email
                </h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="email_notifications"
                    className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-gray-700 border-gray-600"
                  />
                  <label
                    htmlFor="email_notifications"
                    className="ml-2 text-gray-300"
                  >
                    Nhận thông báo qua email
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-lg font-medium text-red-500 mb-3">
                  Vùng nguy hiểm
                </h3>
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
      {activeTab === "watchlist" && (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-3">Phim Yêu Thích</span>
              <span className="text-sm font-normal text-gray-400">
                ({favorites.length} phim)
              </span>
            </h2>
          </div>

          {/* Content Section */}
          <div className="relative min-h-[300px]">
            {isLoadingFavorites ? (
              // Enhanced Loading Skeleton
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 rounded-xl overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[2/3] bg-gray-700/50"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : favorites.length > 0 ? (
              // Enhanced Movie Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favorites.map((movie) => (
                  <Link
                    href={`/movies/${movie._id}`}
                    key={movie._id}
                    className="group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:ring-2 hover:ring-red-500 transition-all duration-300 relative"
                  >
                    {/* Movie Poster */}
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                        alt={movie.title}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Movie Info */}
                    <div className="p-4 space-y-2">
                      <h3 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                        {movie.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-400">
                          <FiCalendar className="mr-1" />
                          <span>{new Date(movie.releaseDate).getFullYear()}</span>
                        </div>
                        <div className="flex items-center text-yellow-500">
                          <span className="mr-1">{movie.voteAverage.toFixed(1)}</span>
                          <span>⭐</span>
                        </div>
                      </div>

                      {/* Hover Info */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/80 px-4 py-2 rounded-full text-white text-sm backdrop-blur-sm">
                          Xem chi tiết
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              // Enhanced Empty State
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
                <div className="text-gray-400 text-6xl mb-6">
                  <FiClock className="animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Chưa có phim yêu thích
                </h3>
                <p className="text-gray-400 text-center mb-8 max-w-md">
                  Khám phá và thêm những bộ phim bạn yêu thích vào danh sách để xem lại sau nhé!
                </p>
                <Link
                  href="/movies"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors inline-flex items-center space-x-2 group"
                >
                  <span>Khám phá ngay</span>
                  <span className="transform transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
