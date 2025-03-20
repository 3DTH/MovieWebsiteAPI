import api from './index';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Thêm các hàm này vào cuối file authApi.ts

// Định nghĩa kiểu dữ liệu cho đăng nhập
export interface LoginData {
  email: string;
  password: string;
}

// Đăng nhập với tài khoản admin
export const loginAdmin = async (data: LoginData) => {
  try {
    // Sửa đường dẫn API cho đúng với backend
    const response = await api.post('/auth/login', data);
    
    // Kiểm tra role của người dùng
    if (response.data && response.data.success) {
      const userData = response.data.user || {};
      
      // Nếu không phải admin, trả về lỗi
      if (userData.role !== 'admin') {
        return {
          data: {
            success: false,
            error: 'Tài khoản này không có quyền truy cập trang quản trị'
          }
        };
      }
      
      // Nếu là admin, lưu token vào adminToken
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

// Lấy thông tin admin hiện tại
export const getCurrentAdmin = async () => {
  try {
    // Sử dụng endpoint user profile thông thường
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${getAdminToken()}`
      }
    });
    
    if (response.data && response.data.success) {
      const userData = response.data.user;
      
      // Kiểm tra xem người dùng có phải là admin không
      if (userData.role !== 'admin') {
        return {
          data: {
            success: false,
            error: 'Không có quyền truy cập'
          }
        };
      }
      
      return {
        data: {
          success: true,
          admin: userData
        }
      };
    } else {
      throw new Error('Failed to fetch admin data');
    }
  } catch (error) {
    console.error("Error fetching current admin:", error);
    throw error;
  }
};

// Kiểm tra xem admin đã đăng nhập chưa
export const isAdminAuthenticated = (): boolean => {
  const token = getAdminToken();
  if (!token) return false;
  
  try {
    // Kiểm tra xem token có hết hạn chưa
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Chuyển đổi về milliseconds
    
    return Date.now() < expiry && payload.role === 'admin';
  } catch (error) {
    return false;
  }
};

// Đăng xuất admin
export const logoutAdmin = (): void => {
  localStorage.removeItem('adminToken');
};

// Lấy token admin từ localStorage
export const getAdminToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

// Đăng ký tài khoản mới
export const register = async (userData: RegisterData) => {
  return api.post<AuthResponse>('/auth/register', userData);
};

// Đăng nhập với email và mật khẩu
export const login = async (loginData: LoginData) => {
  return api.post<AuthResponse>('/auth/login', loginData);
};

// Lấy thông tin người dùng hiện tại (từ API thay vì giải mã token)
export const getCurrentUser = async (): Promise<{
  data: {
    success: boolean;
    user: User;
  };
}> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  
  try {
    // Gửi request đến endpoint /auth/me để lấy thông tin người dùng mới nhất
    const response = await api.get('/auth/me');
    
    if (response.data && response.data.success) {
      return {
        data: {
          success: true,
          user: {
            id: response.data.user._id,
            username: response.data.user.username,
            email: response.data.user.email,
            role: response.data.user.role,
            avatar: response.data.user.avatar,
            createdAt: response.data.user.createdAt
          }
        }
      };
    } else {
      throw new Error('Failed to fetch user data');
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
    
    // Fallback: nếu API không thành công, giải mã token như cũ
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
  
      const userData = JSON.parse(jsonPayload);
      console.log("Fallback to token data:", userData);
      
      return {
        data: {
          success: true,
          user: {
            id: userData.id,
            username: userData.username || userData.email,
            email: userData.email,
            role: userData.role || 'user',
            avatar: userData.avatar || null,
            createdAt: userData.createdAt || null
          }
        }
      };
    } catch (decodeError) {
      console.error("Error decoding token:", decodeError);
      throw new Error('Invalid token');
    }
  }
};

// Kiểm tra xem user đã đăng nhập chưa
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Kiểm tra xem token có hết hạn chưa
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Chuyển đổi về milliseconds
    
    return Date.now() < expiry;
  } catch (error) {
    return false;
  }
};

// Đăng xuất
export const logout = (): void => {
  localStorage.removeItem('token');
};

// Lưu token vào localStorage
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Lấy token từ localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Xử lý đăng nhập thông qua Google
export const getGoogleLoginUrl = (): string => {
  return `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
};

// Xử lý đăng nhập thông qua Facebook
export const getFacebookLoginUrl = (): string => {
  return `${process.env.NEXT_PUBLIC_API_URL}/api/auth/facebook`;
};

// Hàm để xử lý token nhận được từ redirect sau khi đăng nhập bằng Google/Facebook
export const handleSocialLogin = (): boolean => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    
    if (error) {
      throw new Error(decodeURIComponent(error));
    }
    
    if (token) {
      setToken(token);
      // Xóa token khỏi URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Social login error:', error);
    return false;
  }
};

// Kiểm tra xem user có phải là admin không
export const isAdmin = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return user.data.user.role === 'admin';
  } catch (error) {
    return false;
  }
};
