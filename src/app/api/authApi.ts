import api from './index';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
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

export interface LoginData {
  email: string;
  password: string;
}

// Đăng ký tài khoản mới
export const register = async (userData: RegisterData) => {
  return api.post<AuthResponse>('/auth/register', userData);
};

// Đăng nhập với email và mật khẩu
export const login = async (loginData: LoginData) => {
  return api.post<AuthResponse>('/auth/login', loginData);
};

// Lấy thông tin người dùng hiện tại (dựa vào token)
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
  
  // Giải mã JWT để lấy thông tin user (chỉ lấy payload)
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
    
    // Trả về định dạng tương tự response từ API để code khác không phải thay đổi
    return {
      data: {
        success: true,
        user: {
          id: userData.id,
          username: userData.username || userData.email,
          email: userData.email,
          role: userData.role || 'user'
        }
      }
    };
  } catch (error) {
    throw new Error('Invalid token');
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