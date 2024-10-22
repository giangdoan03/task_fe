import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost/task_management",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Add a request interceptor to include token in headers
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
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

    async createTask(taskData) {
        try {
            const response = await apiClient.post("/tasks/store", taskData);
            return response.data;
        } catch (error) {
            throw error.response
                ? error.response.data
                : new Error("Failed to create task");
        }
    },

    async getTasks() {
        try {
            const response = await apiClient.get("/tasks");
            return response.data;
        } catch (error) {
            throw error.response
                ? error.response.data
                : new Error("Failed to retrieve tasks");
        }
    },

    // Thêm API để lấy danh sách người dùng
    async getUsers() {
        try {
            const response = await apiClient.get("/users");
            return response.data;
        } catch (error) {
            throw error.response
                ? error.response.data
                : new Error("Failed to retrieve users");
        }
    },
    async getTaskById(id) {
        try {
            const response = await apiClient.get(`/tasks/${id}`);
            return response.data;
        } catch (error) {
            throw error.response
                ? error.response.data
                : new Error("Failed to retrieve task");
        }
    },

    async updateSubtaskCompletion(payload) {
        try {
            const response = await apiClient.post("/tasks/updateSubTaskCompletion", payload);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Failed to update subtask");
        }
    },

    async createSubtask(payload) {
        try {
            const response = await apiClient.post("/tasks/storeSubTask", payload);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Failed to create subtask");
        }
    },

    // Xóa subtasks (một hoặc nhiều)
    async deleteSubTask(payload) {
        try {
            const response = await apiClient.post("/subtasks/delete", payload);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Failed to delete subtask(s)");
        }
    }
    
};
