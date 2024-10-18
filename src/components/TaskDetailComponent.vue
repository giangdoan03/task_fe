<template>
    <DefaultLayout>
        <div v-if="task">
            <h3>Chi tiết công việc</h3>
            <p><strong>ID:</strong> {{ task.id }}</p>
            <p><strong>Tiêu đề:</strong> {{ task.title }}</p>
            <p><strong>Mô tả:</strong> {{ task.description }}</p>
            <p><strong>Người được giao:</strong> {{ task.assigned_to }}</p>
            <p><strong>Ngày hết hạn:</strong> {{ task.due_date }}</p>
            <p><strong>Ngày tạo:</strong> {{ task.created_at }}</p>
            <p><strong>% Hoàn thành:</strong> {{ task.completion_percentage }}%</p>
        </div>
        <div v-else>
            <p>Đang tải chi tiết công việc...</p>
        </div>
    </DefaultLayout>
</template>

<script>
    import DefaultLayout from './DefaultLayout.vue';
    import apiService from '@/apiService';

    export default {
        name: "TaskDetailComponent",
        components: {
            DefaultLayout
        },
        data() {
            return {
                task: null
            };
        },
        async mounted() {
            const taskId = this.$route.params.id; // Lấy ID công việc từ URL
            try {
                const task = await apiService.getTaskById(taskId); // Gọi API để lấy chi tiết công việc
                this.task = task;
            } catch (error) {
                console.error("Lỗi khi tải chi tiết công việc:", error);
            }
        }
    };
</script>

<style scoped>
    p {
        font-size: 18px;
        margin: 10px 0;
    }
</style>
