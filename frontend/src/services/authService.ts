import api from './api';

// Kiểu dữ liệu gửi đi khi đăng ký
export interface RegisterPayload {
  username: string; // Hoặc fullName tùy backend
  email: string;   
  password: string;
}

// Kiểu dữ liệu gửi đi khi đăng nhập
export interface LoginPayload {
  username: string; // Hoặc email tùy backend setup
  password: string;
}

export const authService = {
  register: async (data: RegisterPayload) => {
    // API trả về: { success: true, data: newUser }
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginPayload) => {
    const response = await api.post('/auth/login', data);

    const responseData = response.data;
    // Lưu token vào localStorage nếu đăng nhập thành công
    if (responseData.success && responseData.data && responseData.data.token) {
        const { token, user } = responseData.data;
        
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(user));
    }
    return responseData;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
};