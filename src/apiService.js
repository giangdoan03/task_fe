// src/apiService.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost/task_management",
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  async login(email, password) {
    const payload = {
      email: email,
      password: password,
    };

    try {
      const response = await apiClient.post("/login", payload);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Login failed");
    }
  },
  async register(name, email, password) {
    const payload = {
      name: name,
      email: email,
      password: password,
    };
    try {
      const response = await apiClient.post("/register", payload);
      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("Registration failed");
    }
  },
  async logout() {
    try {
      await apiClient.post("/logout");
      localStorage.removeItem("token");
    } catch (error) {
      throw error.response ? error.response.data : new Error("Logout failed");
    }
  },
};
