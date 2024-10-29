import axios from "axios";
import router from "@/router"; // Import router để chuyển hướng khi cần

const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});


// Interceptor cho request để thêm token từ localStorage vào headers
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

// Interceptor cho response để kiểm tra lỗi xác thực và chuyển hướng khi cần
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log('Unauthorized - Redirecting to login');
            router.push("/login");  // Không xóa token khỏi localStorage
        }
        return Promise.reject(
            error.response ? error.response.data : new Error("Unexpected Error")
        );
    }
);


export default {
    // apiService.js
    async login(email, password) {
        try {
            const response = await apiClient.post("/login", { email, password });
            return response.data;
        } catch (error) {
            throw error || new Error("Login failed");
        }
    },

    async register(name, email, password) {
        try {
            const response = await apiClient.post("/register", { name, email, password });
            return response.data;
        } catch (error) {
            throw error || new Error("Registration failed");
        }
    },

    async logout() {
        try {
            await apiClient.post("/logout");
            localStorage.removeItem("token"); // Xóa token sau khi đăng xuất
        } catch (error) {
            throw error || new Error("Logout failed");
        }
    },

    async createTask(taskData) {
        try {
            const response = await apiClient.post("/tasks/store", taskData);
            return response.data;
        } catch (error) {
            throw error || new Error("Failed to create task");
        }
    },

    async getTasks() {
        try {
            const response = await apiClient.get("/tasks");
            return response.data;
        } catch (error) {
            throw error || new Error("Failed to retrieve tasks");
        }
    },

    async getUsers() {
        try {
            const response = await apiClient.get("/users");
            return response.data;
        } catch (error) {
            throw error || new Error("Failed to retrieve users");
        }
    },

    async createUser(userData) {
        try {
            const response = await apiClient.post("/users/store", userData);
            return response.data;
        } catch (error) {
            throw error || new Error("Failed to create user");
        }
    },

    async deleteUser(userId) {
        try {
            const response = await apiClient.post("/users/delete", { id: userId });
            return response.data;
        } catch (error) {
            throw error || new Error("Failed to delete user");
        }
    },

    async getTaskById(id) {
        try {
            const response = await apiClient.get(`/tasks/${id}`);
            return response.data;
        } catch (error) {
            throw error || new Error("Failed to retrieve task");
        }
    },

    async updateSubtaskCompletion(payload) {
        try {
            const response = await apiClient.post("/tasks/updateSubTaskCompletion", payload);
            return response.data;
        } catch (error) {
            throw error || new Error("Failed to update subtask");
        }
    },

    async createSubtask(payload) {
        try {
            const response = await apiClient.post("/tasks/storeSubTask", payload);
            return response.data;
        } catch (error) {
            throw error || new Error("Failed to create subtask");
        }
    },

    async deleteSubTask(payload) {
        try {
            const response = await apiClient.post("/subtasks/delete", payload);
            return response.data;
        } catch (error) {
            throw error || new Error("Failed to delete subtask(s)");
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
