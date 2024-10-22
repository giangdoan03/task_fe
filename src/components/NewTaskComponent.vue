<template>
    <DefaultLayout>
        <div class="container my-5">
            <div class="card shadow-sm">
                <div class="card-body">
                    <h3 class="card-title text-center">Tạo công việc mới</h3>
                    <!-- Form tạo công việc mới -->
                    <form @submit.prevent="handleSubmit">
                        <div class="form-group mb-3">
                            <label for="title" class="form-label">Tiêu đề</label>
                            <input
                                type="text"
                                id="title"
                                v-model="task.title"
                                class="form-control"
                                placeholder="Nhập tiêu đề công việc"
                                required
                            />
                        </div>
                        <div class="form-group mb-3">
                            <label for="description" class="form-label">Mô tả</label>
                            <textarea
                                id="description"
                                v-model="task.description"
                                class="form-control"
                                placeholder="Nhập mô tả công việc"
                                required
                            ></textarea>
                        </div>
                        <div class="form-group mb-3">
                            <label for="assigned_to" class="form-label">Người được giao</label>
                            <select
                                id="assigned_to"
                                v-model="task.assigned_to"
                                class="form-control"
                                required
                            >
                                <option disabled value="">Chọn người dùng</option>
                                <option v-for="user in users" :key="user.id" :value="user.id">
                                    {{ user.email }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group mb-3">
                            <label for="due_date" class="form-label">Ngày hết hạn</label>
                            <input
                                type="date"
                                id="due_date"
                                v-model="task.due_date"
                                class="form-control"
                                required
                            />
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Lưu lại</button>
                    </form>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>

<script>
    import DefaultLayout from './DefaultLayout.vue';
    import apiService from '@/apiService'; // Import apiService để gọi API

    export default {
        name: 'NewTaskComponent',
        components: {
            DefaultLayout
        },
        data() {
            return {
                task: {
                    title: "",
                    description: "",
                    assigned_to: "",
                    due_date: "",
                },
                users: [] // Mảng chứa danh sách người dùng
            };
        },
        async mounted() {
            try {
                // Gọi API để lấy danh sách người dùng
                const users = await apiService.getUsers();
                this.users = users; // Lưu danh sách người dùng vào mảng users
            } catch (error) {
                console.error("Lỗi khi tải danh sách người dùng:", error);
            }
        },
        methods: {
            async handleSubmit() {
                try {
                    // Gọi API từ apiService để tạo task
                    await apiService.createTask(this.task);
                    alert("Task đã được lưu thành công!");

                    // Reset form sau khi lưu
                    this.task = {
                        title: "",
                        description: "",
                        assigned_to: "",
                        due_date: "",
                    };
                } catch (error) {
                    alert("Đã có lỗi xảy ra: " + error.message);
                    console.error("Lỗi khi gọi API:", error);
                }
            }
        }
    };
</script>

<style scoped>
    .container {
        max-width: 600px;
    }

    .card-title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .form-control {
        height: 45px;
        font-size: 16px;
        border-radius: 6px;
    }

    .form-control:focus {
        box-shadow: none;
        border-color: #007bff;
    }

    .btn-primary {
        background-color: #007bff;
        border-color: #007bff;
        font-size: 18px;
        padding: 12px;
    }

    .btn-primary:hover {
        background-color: #0056b3;
        border-color: #004085;
    }

    textarea.form-control {
        min-height: 120px;
        resize: none;
    }

    .card {
        border-radius: 10px;
        border: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .card-body {
        padding: 30px;
    }
</style>
