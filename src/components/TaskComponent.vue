<template>
    <DefaultLayout>
        <div class="container">
            <h3 class="mb-4">Danh sách công việc</h3>
            <!-- Bảng hiển thị danh sách công việc với Bootstrap -->
            <table class="table table-hover table-bordered table-striped">
                <thead class="thead-light">
                <tr>
                    <th>ID</th>
                    <th>Tiêu đề</th>
                    <th>Mô tả</th>
                    <th>Người được giao</th>
                    <th>Ngày hết hạn</th>
                    <th>Ngày tạo</th>
                    <th>Hoàn thành</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="task in tasks" :key="task.id" @click="goToDetail(task.id)">
                    <td>{{ task.id }}</td>
                    <td>{{ task.title }}</td>
                    <td>{{ task.description }}</td>
                    <td>{{ task.assigned_to }}</td>
                    <td>{{ task.due_date }}</td>
                    <td>{{ task.created_at }}</td>
                    <td>{{ task.completion_percentage }}%</td>
                </tr>
                </tbody>
            </table>
        </div>
    </DefaultLayout>
</template>

<script>
    import DefaultLayout from './DefaultLayout.vue';
    import apiService from '@/apiService'; // Sử dụng apiService để lấy dữ liệu

    export default {
        name: "TaskComponent",
        components: {
            DefaultLayout
        },
        data() {
            return {
                tasks: [] // Mảng chứa danh sách các công việc
            };
        },
        async mounted() {
            try {
                // Gọi API từ apiService để lấy danh sách công việc
                const tasks = await apiService.getTasks();
                this.tasks = tasks; // Lưu danh sách công việc vào mảng tasks
            } catch (error) {
                console.error("Lỗi khi tải danh sách công việc:", error);
            }
        },
        methods: {
            goToDetail(taskId) {
                this.$router.push({ name: 'TaskDetail', params: { id: taskId } });
            }
        }
    };
</script>

<style scoped>
/* Không cần thêm quá nhiều CSS vì đã có các lớp của Bootstrap */
</style>
