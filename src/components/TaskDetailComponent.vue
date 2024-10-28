<template>
    <DefaultLayout>
        <div v-if="task" class="container mt-5">
            <div class="card trello-card">
                <div class="card-header">
                    <h3 class="card-title">{{ task.title }}</h3>
                    <p><strong>ID:</strong> {{ task.id }}</p>
                </div>
                <div class="card-body">
                    <div class="task-details">
                        <p><strong>Mô tả:</strong> {{ task.description }}</p>
                        <p><strong>Người được giao:</strong> {{ task.assigned_to }}</p>
                        <p><strong>Ngày hết hạn:</strong> {{ task.due_date }}</p>
                        <p><strong>Ngày tạo:</strong> {{ task.created_at }}</p>
                        <p><strong>Hoàn thành:</strong> {{ task.completion_percentage }}%</p>
                    </div>

                    <div class="subtasks-section mt-4">
                        <div class="subtasks-header d-flex justify-content-between align-items-center">
                            <h5>Danh sách công việc con</h5>
                            <!-- Nút tạo subtask -->
                            <button class="btn btn-primary" @click="showSubtaskForm = !showSubtaskForm">Tạo
                                subtask</button>
                        </div>

                        <!-- Form tạo subtask -->
                        <div v-if="showSubtaskForm" class="subtask-form mb-4">
                            <input v-model="newSubtaskTitle" type="text" placeholder="Tiêu đề công việc con"
                                class="form-control mb-2" />
                            <textarea v-model="newSubtaskDescription" placeholder="Mô tả công việc con"
                                class="form-control mb-2"></textarea>
                            <button @click="createSubtask" class="btn btn-success">Lưu</button>
                        </div>

                        <!-- Danh sách subtasks -->
                        <div v-if="task.subtasks && task.subtasks.length > 0">
                            <ul class="list-group list-group-flush">
                                <li v-for="subTask in task.subtasks" :key="subTask.id"
                                    class="list-group-item subtask-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <div v-if="subTask.id === editingSubtaskId">
                                            <!-- Khi đang sửa, hiển thị input -->
                                            <input type="text" v-model="editableTitle" @keyup.enter="saveTitle(subTask)"
                                                @blur="saveTitle(subTask)" class="form-control" autofocus />
                                        </div>
                                        <div v-else>
                                            <!-- Hiển thị tiêu đề dưới dạng text khi không chỉnh sửa -->
                                            <strong @click="editTitle(subTask)">{{ subTask.title }}</strong>
                                            <p><strong>Hoàn thành:</strong> {{ subTask.is_completed ? 'Đã hoàn thành' :
                                                'Chưa hoàn thành' }}</p>
                                        </div>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <!-- Checkbox hoàn thành công việc -->
                                        <input type="checkbox" class="form-check-input me-2"
                                            :checked="subTask.is_completed" @change="updateCompletion(subTask)" />
                                        <!-- Nút xóa -->
                                        <i @click="deleteSubTask(subTask.id)" class="bi bi-trash text-danger"
                                            style="cursor: pointer;"></i>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Tổng tiến độ -->
                    <div class="progress-section mt-4">
                        <h6>Tổng tiến độ công việc con</h6>
                        <div class="progress">
                            <div class="progress-bar" :style="{ width: totalProgress + '%' }">{{ totalProgress }}%</div>
                        </div>
                    </div>

                    <!-- Phần bình luận -->
                    <div v-if="task && task.id" class="comments-section mt-4">
                        <h5>Bình luận</h5>
                        <div v-for="comment in comments" :key="comment.id" class="comment">
                            <strong>{{ comment.name }}</strong>: {{ comment.content }}
                            <small>{{ comment.created_at }}</small>
                        </div>

                        <!-- Form thêm bình luận -->
                           <!-- Form thêm bình luận -->
                        <textarea v-model="newComment" placeholder="Thêm bình luận..." class="form-control mb-2"></textarea>
                        <button @click="submitComment" class="btn btn-success" :disabled="!task || typeof task.id === 'undefined'">Gửi bình luận</button>
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
import apiService from '@/apiService'; // Import apiService
import Swal from 'sweetalert2'; // Import SweetAlert2 để thông báo
import { useUserStore } from '@/stores/userStore'; // Import store

export default {
    name: "TaskDetailComponent",
    components: {
        DefaultLayout
    },
    data() {
        return {
            task: null,  // Dữ liệu task sẽ được lấy từ API
            isLoading: true, // Trạng thái loading
            error: null, // Trạng thái lỗi nếu có
            showSubtaskForm: false, // Trạng thái ẩn/hiện form tạo subtask
            newSubtaskTitle: '', // Tiêu đề subtask mới
            newSubtaskDescription: '',// Mô tả subtask mới,
            editingSubtaskId: null, // ID của subtask đang sửa
            editableTitle: '', // Tiêu đề tạm thời khi sửa
            comments: [],
            newComment: '',
        };
    },
    computed: {
        // Tính tổng tiến độ hoàn thành dựa trên số subtasks đã hoàn thành
        totalProgress() {
            if (this.task && this.task.subtasks && this.task.subtasks.length > 0) {
                const completedSubtasks = this.task.subtasks.filter(subTask => subTask.is_completed === 1).length;
                return Math.round((completedSubtasks / this.task.subtasks.length) * 100);
            }
            return 0;
        }
    },
    mounted() {
        const taskId = this.$route.params.id; // Lấy ID task từ route params (nếu dùng vue-router)
        this.fetchTaskDetails(taskId)
            .then(() => {
                if (this.task && this.task.id) {
                    // Chỉ gọi fetchComments sau khi task đã được tải thành công
                    this.fetchComments();
                } else {
                    console.error("Task chưa được tải đầy đủ");
                }
            });
    },
    methods: {
        async fetchTaskDetails(taskId) {
            try {
                const response = await apiService.getTaskById(taskId);
                this.task = response;  // Lưu dữ liệu task vào data
            } catch (error) {
                this.error = error.message || "Đã có lỗi xảy ra khi tải chi tiết công việc.";
                console.error("Lỗi khi gọi API:", error);
            } finally {
                this.isLoading = false;  // Kết thúc trạng thái loading
            }
        },
        // Hàm cập nhật trạng thái hoàn thành của subtask
        async updateCompletion(subTask) {
            subTask.is_completed = subTask.is_completed ? 0 : 1; // Toggle trạng thái khi checkbox được click

            const payload = {
                id: subTask.id,
                is_completed: subTask.is_completed,
                task_id: this.task.id,
                title: subTask.title,
                description: subTask.description
            };

            try {
                await apiService.updateSubtaskCompletion(payload);
                this.calculateCompletionPercentage();
            } catch (error) {
                console.error('Lỗi khi cập nhật subtask:', error);
                alert('Có lỗi xảy ra khi cập nhật công việc con.');
            }
        },
        // Tính lại phần trăm hoàn thành của task dựa trên các subtasks
        calculateCompletionPercentage() {
            if (this.task && this.task.subtasks && this.task.subtasks.length > 0) {
                const completedSubtasks = this.task.subtasks.filter(subTask => subTask.is_completed === 1).length;
                this.task.completion_percentage = Math.round((completedSubtasks / this.task.subtasks.length) * 100);
            } else {
                this.task.completion_percentage = 0;
            }
        },
        // Hàm tạo subtask mới
        async createSubtask() {
            if (!this.newSubtaskTitle) {
                alert('Vui lòng nhập tiêu đề công việc con');
                return;
            }

            const payload = {
                title: this.newSubtaskTitle,
                description: this.newSubtaskDescription,
                task_id: this.task.id,
                is_completed: 0
            };

            try {
                const response = await apiService.createSubtask(payload);

                if (response && response.title) {
                    this.task.subtasks.push(response);
                } else {
                    console.error("Không tìm thấy tiêu đề trong phản hồi từ API");
                }

                this.newSubtaskTitle = '';
                this.newSubtaskDescription = '';
                this.showSubtaskForm = false;
            } catch (error) {
                console.error("Lỗi khi tạo subtask:", error);
                alert("Có lỗi xảy ra khi tạo công việc con.");
            }
        },
        // Sửa tiêu đề công việc con
        editTitle(subTask) {
            this.editingSubtaskId = subTask.id;
            this.editableTitle = subTask.title;
        },
        // Lưu tiêu đề sau khi sửa
        async saveTitle(subTask) {
            if (this.editableTitle.trim() === '') {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Tiêu đề không được để trống!',
                });
                return;
            }

            subTask.title = this.editableTitle;
            this.editingSubtaskId = null;

            const payload = {
                id: subTask.id,
                is_completed: subTask.is_completed,
                task_id: this.task.id,
                title: subTask.title,
                description: subTask.description,
            };

            try {
                await apiService.updateSubtaskCompletion(payload);
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Tiêu đề đã được cập nhật thành công!',
                });
            } catch (error) {
                console.error('Lỗi khi cập nhật tiêu đề subtask:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Có lỗi xảy ra khi cập nhật tiêu đề.',
                });
            }
        },
        // Xóa một subtask
        async deleteSubTask(subTaskId) {
            try {
                await apiService.deleteSubTask({ subtask_ids: [subTaskId] });
                this.task.subtasks = this.task.subtasks.filter(subTask => subTask.id !== subTaskId);
            } catch (error) {
                console.error("Lỗi khi xóa subtask:", error);
                alert("Có lỗi xảy ra khi xóa công việc con.");
            }
        },

        async fetchComments() {
            try {
                const response = await apiService.getCommentsByTaskId(this.task.id);
                this.comments = response;
            } catch (error) {
                console.error('Lỗi khi lấy bình luận:', error);
            }
        },
        async submitComment() {
            const userStore = useUserStore();

            // Kiểm tra xem task đã được tải và có giá trị id hay không
            if (!this.task || typeof this.task.id === 'undefined') {
                console.error("Task không được tải hoặc không có giá trị ID.");
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Công việc chưa được tải hoàn toàn. Vui lòng thử lại sau.',
                });
                return;
            }

            if (this.newComment.trim() === '') {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Bình luận không được để trống!',
                });
                return;
            }

            if (!userStore.user) {
                console.error("User không tồn tại");
                return;
            }

            const payload = {
                task_id: this.task.id, // Chỉ truy cập task_id khi task đã tồn tại
                user_id: userStore.user.id,
                content: this.newComment,
            };

            try {
                await apiService.createComment(payload);
                this.newComment = ''; // Reset form bình luận
                this.fetchComments(); // Lấy lại danh sách bình luận
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Thành công',
                //     text: 'Bình luận đã được thêm thành công!',
                // });
            } catch (error) {
                console.error('Lỗi khi thêm bình luận:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Có lỗi xảy ra khi thêm bình luận.',
                });
            }
        }
    }
};
</script>

<style scoped>
.trello-card {
    max-width: 800px;
    margin: 0 auto;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    background-color: #f8f9fa;
}

.card-header {
    background-color: #007bff;
    color: white;
    border-radius: 10px 10px 0 0;
}

.task-details p,
.subtasks-section p {
    margin-bottom: 0.5rem;
}

.subtasks-header h5 {
    margin-bottom: 0;
}

.subtask-item {
    background-color: #fff;
    margin-bottom: 5px;
    border-radius: 5px;
    border: 1px solid #ddd;
}

.progress-section {
    margin-top: 20px;
}

.progress-bar {
    background-color: #28a745;
}

.spinner-border {
    width: 3rem;
    height: 3rem;
}
</style>
