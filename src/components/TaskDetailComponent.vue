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

            <!-- Vẫn hiển thị nút tạo subtask, ngay cả khi không có subtasks -->
            <div class="mt-4">
                <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title">Danh sách công việc con</h5>
                    <!-- Nút tạo subtask -->
                    <button class="btn btn-primary" @click="showSubtaskForm = !showSubtaskForm">Tạo subtask</button>
                </div>
                <div class="card-body">
                    <!-- Hiển thị form tạo subtask -->
                    <div v-if="showSubtaskForm" class="mb-4">
                        <input v-model="newSubtaskTitle" type="text" placeholder="Tiêu đề công việc con" class="form-control mb-2" />
                        <textarea v-model="newSubtaskDescription" placeholder="Mô tả công việc con" class="form-control mb-2"></textarea>
                        <button @click="createSubtask" class="btn btn-success">Lưu</button>
                    </div>

                    <!-- Hiển thị danh sách subtasks nếu có subtasks -->
                    <div v-if="task.subtasks && task.subtasks.length > 0">
                        <!-- Checkbox chọn tất cả subtasks -->
                        <div class="form-check mb-2">
                            <input
                                type="checkbox"
                                class="form-check-input"
                                id="selectAll"
                                v-model="selectAll"
                                @change="toggleSelectAll"
                            />
                            <label class="form-check-label" for="selectAll">Chọn tất cả</label>
                        </div>

                        <!-- Danh sách subtasks -->
                        <ul class="list-group list-group-flush">
                            <li v-for="subTask in task.subtasks" :key="subTask.id" class="list-group-item d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <!-- Checkbox để chọn subtasks -->
                                    <input
                                        type="checkbox"
                                        class="form-check-input me-2"
                                        :value="subTask.id"
                                        v-model="selectedSubTasks"
                                        @change="toggleSubTaskSelection"
                                    />
                                    <div>
                                        <div v-if="subTask.id === editingSubtaskId">
                                            <!-- Khi click vào tiêu đề, hiển thị input -->
                                            <input
                                                type="text"
                                                v-model="editableTitle"
                                                @keyup.enter="saveTitle(subTask)"
                                                @blur="saveTitle(subTask)"
                                                class="form-control"
                                                autofocus
                                            />
                                        </div>
                                        <div v-else @click="editTitle(subTask)">
                                            <!-- Khi chưa chỉnh sửa, hiển thị tiêu đề dưới dạng text -->
                                            <strong>Tiêu đề:</strong> {{ subTask.title }} <br>
                                        </div>
                                        <strong>Hoàn thành:</strong> {{ subTask.is_completed ? 'Đã hoàn thành' : 'Chưa hoàn thành' }}
                                    </div>
                                </div>
                                <div class="d-flex align-items-center">
                                    <!-- Checkbox hoàn thành công việc -->
                                    <input type="checkbox" class="form-check-input me-2" :checked="subTask.is_completed === 1" @change="updateCompletion(subTask)" />
                                    <!-- Nút xóa công việc con -->
                                    <i @click="deleteSubTask(subTask.id)" class="bi bi-trash text-danger" style="cursor: pointer;"></i>
                                </div>
                            </li>
                        </ul>

                        <!-- Nút xóa tất cả subtasks được chọn -->
                        <button class="btn btn-danger mt-3" @click="deleteSelectedSubTasks" v-if="selectedSubTasks.length > 0">Xóa các công việc đã chọn</button>
                    </div>

                    <!-- Hiển thị khi không có subtasks -->
                    <div v-else class="text-center">
                        <p>Không có công việc con nào.</p>
                    </div>
                </div>
            </div>

            </div>

            <!-- Tổng progress bar -->
            <div class="card mt-4">
                <div class="card-header">
                    <h5 class="card-title">Tổng tiến độ công việc con</h5>
                </div>
                <div class="card-body">
                    <div class="progress">
                        <div
                            class="progress-bar bg-success"
                            role="progressbar"
                            :style="{ width: totalProgress + '%' }"
                            :aria-valuenow="totalProgress"
                            aria-valuemin="0"
                            aria-valuemax="100">
                            {{ totalProgress }}%
                        </div>
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
                selectAll: false, // Biến để quản lý trạng thái chọn tất cả
                selectedSubTasks: [], // Mảng chứa các subtasks đã chọn
                editingSubtaskId: null, // ID của subtask đang sửa
                editableTitle: '', // Tiêu đề tạm thời khi sửa
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
            this.fetchTaskDetails(taskId);
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

                // Chuẩn bị dữ liệu để gửi đến API
                const payload = {
                    id: subTask.id, // ID của subtask
                    is_completed: subTask.is_completed, // Trạng thái đã hoàn thành hoặc chưa
                    task_id: this.task.id, // ID của task lớn mà subtask thuộc về
                    title: subTask.title, // Cập nhật tiêu đề subtask
                    description: subTask.description // Cập nhật mô tả subtask
                };

                try {
                    // Gọi API để cập nhật trạng thái subtask trong backend
                    await apiService.updateSubtaskCompletion(payload);
                    
                    // Recalculate task completion percentage after subtask update
                    this.calculateCompletionPercentage();
                } catch (error) {
                    console.error('Lỗi khi cập nhật subtask:', error);
                    alert('Có lỗi xảy ra khi cập nhật công việc con.');
                }
            },
            // Hàm để tính lại phần trăm hoàn thành của task dựa trên các subtasks
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
                    is_completed: 0 // Giá trị mặc định
                };

                try {
                    const response = await apiService.createSubtask(payload);

                    // Kiểm tra phản hồi từ API có chứa thông tin title hay không
                    console.log(response); // In ra để kiểm tra nội dung trả về từ API

                    // Nếu phản hồi chứa tiêu đề, thêm subtask vào danh sách
                    if (response && response.title) {
                        this.task.subtasks.push(response); // Thêm subtask mới vào danh sách
                    } else {
                        console.error("Không tìm thấy tiêu đề trong phản hồi từ API");
                    }

                    // Xóa nội dung form sau khi lưu
                    this.newSubtaskTitle = '';
                    this.newSubtaskDescription = '';
                    this.showSubtaskForm = false; // Ẩn form sau khi tạo
                } catch (error) {
                    console.error("Lỗi khi tạo subtask:", error);
                    alert("Có lỗi xảy ra khi tạo công việc con.");
                }
            },

            // Chọn tất cả subtasks
            toggleSelectAll() {
                this.selectedSubTasks = this.selectAll ? this.task.subtasks.map(subTask => subTask.id) : [];
            },
             // Khi người dùng chọn hoặc bỏ chọn một subtask
            toggleSubTaskSelection() {
                // Nếu tất cả subtasks đều được chọn, cập nhật selectAll = true, ngược lại thì false
                this.selectAll = this.selectedSubTasks.length === this.task.subtasks.length;
            },
            // Xóa một subtask
            async deleteSubTask(subTaskId) {
                try {
                    await apiService.deleteSubTask({ subtask_ids: [subTaskId] });
                    this.task.subtasks = this.task.subtasks.filter(subTask => subTask.id !== subTaskId);
                    // Cập nhật lại trạng thái sau khi xóa subtask
                    this.toggleSubTaskSelection();
                } catch (error) {
                    console.error("Lỗi khi xóa subtask:", error);
                    alert("Có lỗi xảy ra khi xóa công việc con.");
                }
            },
                    // Xóa các subtasks được chọn
            async deleteSelectedSubTasks() {
                try {
                    await apiService.deleteSubTask({ subtask_ids: this.selectedSubTasks });
                    this.task.subtasks = this.task.subtasks.filter(subTask => !this.selectedSubTasks.includes(subTask.id));
                    this.selectedSubTasks = [];
                    this.selectAll = false;
                } catch (error) {
                    console.error("Lỗi khi xóa các subtasks:", error);
                    alert("Có lỗi xảy ra khi xóa các công việc đã chọn.");
                }
            },
              // Phương thức bắt đầu sửa tiêu đề
            editTitle(subTask) {
                this.editingSubtaskId = subTask.id; // Đặt ID subtask đang chỉnh sửa
                this.editableTitle = subTask.title; // Đặt tiêu đề hiện tại vào editableTitle
            },
            // Phương thức để lưu tiêu đề sau khi nhấn Enter hoặc mất focus
            async saveTitle(subTask) {
                if (this.editableTitle.trim() === '') {
                    alert('Tiêu đề không được để trống');
                    return;
                }

                subTask.title = this.editableTitle; // Cập nhật tiêu đề subtask
                this.editingSubtaskId = null; // Đặt lại để ẩn input

                const payload = {
                    id: subTask.id,
                    is_completed: subTask.is_completed,
                    task_id: this.task.id,
                    title: subTask.title, // Tiêu đề đã chỉnh sửa
                    description: subTask.description,
                };

                try {
                    await apiService.updateSubtaskCompletion(payload);
                    alert('Tiêu đề đã được cập nhật thành công.');
                } catch (error) {
                    console.error('Lỗi khi cập nhật tiêu đề subtask:', error);
                    alert('Có lỗi xảy ra khi cập nhật tiêu đề.');
                }
            },


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
