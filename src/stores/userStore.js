// src/stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null, // Khôi phục user từ localStorage nếu có
    token: localStorage.getItem('token') || null,           // Khôi phục token từ localStorage nếu có
  }),
  actions: {
    login(user, token) {
      this.user = user;
      this.token = token;

      // Lưu user và token vào localStorage để duy trì sau khi tải lại
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      console.log('User and token stored:', this.user, this.token);  // Debug
    },
    logout() {
      this.user = null;
      this.token = null;

      // Xóa user và token khỏi localStorage khi đăng xuất
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    initUser() {
      // Khôi phục user và token từ localStorage khi gọi hàm này (nếu chưa khôi phục ở state)
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        this.user = JSON.parse(storedUser);
        this.token = storedToken;
      }
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
});
