import { create } from 'zustand';
import { loginApi } from '../services/auth.service';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email, password) => {
    try {
      const data = await loginApi(email, password);
      localStorage.setItem('qb_token', data.token);
      localStorage.setItem('qb_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Invalid credentials';
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem('qb_token');
    localStorage.removeItem('qb_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem('qb_token');
    const userStr = localStorage.getItem('qb_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch {
        get().logout();
      }
    }
  },
}));

export default useAuthStore;
