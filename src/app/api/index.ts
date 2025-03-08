import axios from 'axios';

// Tạo một axios instance với cấu hình mặc định
export const api = axios.create({
  baseURL: `http://localhost:8080/api`, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Thêm interceptor để xử lý token authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý các lỗi chung như 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Xử lý logout hoặc refresh token
    }
    return Promise.reject(error);
  }
);

export default api;