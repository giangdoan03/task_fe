<template>
    <DefaultLayout>
        <div v-if="task" class="container mt-5">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Chi tiết công việc</h3>
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <strong>ID:</strong> {{ task.id }}
                        </li>
                        <li class="list-group-item">
                            <strong>Tiêu đề:</strong> {{ task.title }}
                        </li>
                        <li class="list-group-item">
                            <strong>Mô tả:</strong> {{ task.description }}
                        </li>
                        <li class="list-group-item">
                            <strong>Người được giao:</strong> {{ task.assigned_to }}
                        </li>
                        <li class="list-group-item">
                            <strong>Ngày hết hạn:</strong> {{ task.due_date }}
                        </li>
                        <li class="list-group-item">
                            <strong>Ngày tạo:</strong> {{ task.created_at }}
                        </li>
                        <li class="list-group-item">
                            <strong>Hoàn thành:</strong> {{ task.completion_percentage }}%
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Hiển thị danh sách sub-tasks nếu có -->
            <div v-if="task.sub_tasks && task.sub_tasks.length > 0" class="mt-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Danh sách công việc con</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush">
                            <li v-for="subTask in task.sub_tasks" :key="subTask.id" class="list-group-item">
                                <strong>Tiêu đề:</strong> {{ subTask.title }} <br>
                                <strong>Hoàn thành:</strong> {{ subTask.completion_percentage }}%
                                <div class="progress mt-2">
                                    <div
                                        class="progress-bar"
                                        role="progressbar"
                                        :style="{ width: subTask.completion_percentage + '%' }"
                                        :aria-valuenow="subTask.completion_percentage"
                                        aria-valuemin="0"
                                        aria-valuemax="100">
                                        {{ subTask.completion_percentage }}%
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="container mt-5 text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Đang tải chi tiết công việc...</p>
        </div>
    </DefaultLayout>
</template>

<script>
    import DefaultLayout from './DefaultLayout.vue';

    export default {
        name: "TaskDetailComponent",
        components: {
            DefaultLayout
        },
        data() {
            return {
                // Fake data cho task và sub-tasks
                task: {
                    id: 1,
                    title: "Công việc lớn",
                    description: "Mô tả chi tiết của công việc lớn này.",
                    assigned_to: "Nguyễn Văn A",
                    due_date: "2024-12-31",
                    created_at: "2024-01-01",
                    completion_percentage: 75,
                    sub_tasks: [
                        {
                            id: 101,
                            title: "Sub-task 1",
                            completion_percentage: 50
                        },
                        {
                            id: 102,
                            title: "Sub-task 2",
                            completion_percentage: 80
                        },
                        {
                            id: 103,
                            title: "Sub-task 3",
                            completion_percentage: 100
                        }
                    ]
                }
            };
        },
        mounted() {
            // Giả lập API call (không thực sự gọi API trong ví dụ này)
            console.log("Fake data loaded for task and sub-tasks.");
        }
    };
</script>

<style scoped>
    .card {
        max-width: 600px;
        margin: 0 auto;
    }
    .spinner-border {
        width: 3rem;
        height: 3rem;
    }
    .progress {
        height: 20px;
    }
    .progress-bar {
        background-color: #28a745; /* Màu sắc cho thanh tiến trình */
    }
</style>
