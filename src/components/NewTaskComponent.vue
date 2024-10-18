<template>
    <DefaultLayout>
        <div class="container">
            <h3>Tạo công việc mới</h3>
            <!-- Form tạo công việc mới -->
            <form @submit.prevent="handleSubmit">
                <div class="form-group">
                    <label for="title">Tiêu đề</label>
                    <input
                            type="text"
                            id="title"
                            v-model="task.title"
                            class="form-control"
                            required
                    />
                </div>
                <div class="form-group">
                    <label for="description">Mô tả</label>
                    <textarea
                            id="description"
                            v-model="task.description"
                            class="form-control"
                            required
                    ></textarea>
                </div>
                <div class="form-group">
                    <label for="assigned_to">Người được giao</label>
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
                <div class="form-group">
                    <label for="due_date">Ngày hết hạn</label>
                    <input
                            type="date"
                            id="due_date"
                            v-model="task.due_date"
                            class="form-control"
                            required
                    />
                </div>
                <button type="submit" class="btn btn-primary mt-3">Lưu lại</button>
            </form>
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
    .form-group {
        margin-bottom: 15px;
    }

    .form-control {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button.btn-primary {
        background-color: #007bff;
        border: none;
        padding: 10px 20px;
        color: #fff;
        cursor: pointer;
    }

    button.btn-primary:hover {
        background-color: #0056b3;
    }
</style>
