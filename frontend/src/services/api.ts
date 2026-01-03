import axios from "axios";

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Base URL chung cho cả v1 và auth
  headers: {
    "Content-Type": "application/json",
  },
});

// (Tùy chọn) Thêm interceptor để tự động gắn Token nếu đã đăng nhập
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
