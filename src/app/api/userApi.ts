import { api } from './index';

// Kiểu dữ liệu cho user
export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  favorites?: string[];
}

// Kiểu dữ liệu cho avatar
export interface Avatar {
  id: number;
  path: string;
}

// Kiểu dữ liệu cho Movie
export interface Movie {
  _id: string;
  tmdbId: string;
  title: string;
  posterPath: string;
  backdropPath: string;
  overview: string;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
}

// Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}

// Lấy thông tin user theo ID (chỉ admin)
export const getUserById = async (userId: string): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`
    }
  });
  return response.data;
};

// Lấy danh sách users (chỉ admin)
export const getUsers = async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> => {
  const response = await api.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`
    }
  });
  return response.data;
};

// Tạo user mới (chỉ admin)
export const createUser = async (userData: {
  username: string;
  email: string;
  password: string;
  role?: string;
}): Promise<ApiResponse<User>> => {
  const response = await api.post<ApiResponse<User>>('/users', userData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`
    }
  });
  return response.data;
};

// Cập nhật user (chỉ admin)
export const updateUser = async (
  userId: string,
  userData: {
    username?: string;
    email?: string;
    role?: string;
    avatar?: string;
  }
): Promise<ApiResponse<User>> => {
  const response = await api.put<ApiResponse<User>>(`/users/${userId}`, userData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`
    }
  });
  return response.data;
};

// Xóa user (chỉ admin)
export const deleteUser = async (userId: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`
    }
  });
  return response.data;
};

// Lấy danh sách avatar có sẵn
export const getAvatars = async (): Promise<ApiResponse<Avatar[]>> => {
  const response = await api.get<ApiResponse<Avatar[]>>('/users/avatars');
  return response.data;
};

// Cập nhật avatar của người dùng hiện tại
export const updateAvatar = async (avatarPath: string): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User & { token: string }>>('/users/avatar', { avatarPath });
    
    // Nếu cập nhật thành công và server trả về token mới
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    
    return response.data;
  };

// Cập nhật username của người dùng hiện tại
export const updateUsername = async (username: string): Promise<ApiResponse<User>> => {
  try {
    const response = await api.put<ApiResponse<User>>('/users/username', { username });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.error || 'Không thể cập nhật username');
    }
    throw error;
  }
};

// ========== FAVORITES API ==========

// Lấy danh sách phim yêu thích của người dùng hiện tại
export const getFavorites = async (): Promise<ApiResponse<Movie[]>> => {
  const response = await api.get<ApiResponse<Movie[]>>('/favorites');
  return response.data;
};

// Thêm phim vào danh sách yêu thích
export const addToFavorites = async (movieId: string): Promise<ApiResponse<Movie[]>> => {
  const response = await api.post<ApiResponse<Movie[]>>(`/favorites/${movieId}`);
  return response.data;
};

// Xóa phim khỏi danh sách yêu thích
export const removeFromFavorites = async (movieId: string): Promise<ApiResponse<Movie[]>> => {
  const response = await api.delete<ApiResponse<Movie[]>>(`/favorites/${movieId}`);
  return response.data;
};

// Kiểm tra xem phim có trong danh sách yêu thích không
export const checkIsFavorite = async (movieId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.data.some(movie => movie.tmdbId === movieId || movie._id === movieId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};