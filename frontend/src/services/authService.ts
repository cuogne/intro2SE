import api from './api';

// Kiểu dữ liệu gửi đi khi đăng ký
export interface RegisterPayload {
  username: string; // Hoặc fullName tùy backend
  email?: string;   // Nếu backend cần
  password: string;
}

// Kiểu dữ liệu gửi đi khi đăng nhập
export interface LoginPayload {
  username: string; // Hoặc email tùy backend setup
  password: string;
}

export const authService = {
  register: async (data: RegisterPayload) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginPayload) => {
    const response = await api.post('/auth/login', data);
    // Lưu token vào localStorage nếu đăng nhập thành công
    if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Lưu thông tin user
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
};