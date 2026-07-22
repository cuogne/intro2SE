import api from './api';

export interface RegisterPayload {
  username: string;
  email: string;   
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export const authService = {
  register: async (data: RegisterPayload) => {
    const response = await api.post('/v1/auth/register', data);
    return response.data;
  },

  login: async (data: LoginPayload) => {
    const response = await api.post('/v1/auth/login', data);

    const responseData = response.data;
    if (responseData.success && responseData.data) {
        const { accessToken, refreshToken, user } = responseData.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
    }
    return responseData;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    if (refreshToken) {
      try {
        await api.post('/v1/auth/logout', { refreshToken });
      } catch {
        // ignore
      }
    }
  }
};