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
    // apiService.js
    async login(email, password) {
        const response = await apiClient.post('/login', { email, password });

        console.log('response',response)
        
        // Kiểm tra phản hồi từ API
        console.log('API response:', response.data);
        
        return response.data; // Đảm bảo rằng `response.data` chứa cả `user` và `token`
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

    // Tạo người dùng mới
    async createUser(userData) {
        try {
            const response = await apiClient.post("/users/store", userData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Failed to create user");
        }
    },

    // API để xóa người dùng
    async deleteUser(userId) {
        try {
            const response = await apiClient.post("/users/delete", { id: userId });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Failed to delete user");
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
    },

    // Lấy danh sách bình luận theo taskId
    async getCommentsByTaskId(taskId) {
        try {
            const response = await apiClient.get(`/comments/task`, {
                params: { task_id: taskId }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Failed to fetch comments");
        }
    },

    // Tạo một bình luận mới
    async createComment(payload) {
        try {
            const response = await apiClient.post(`/comments/store`, payload);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Failed to create comment");
        }
    }

};
