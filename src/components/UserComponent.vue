<template>
    <DefaultLayout>
        <div class="container">
            <h3 class="mb-4">Danh sách thành viên</h3>

            <!-- Nút tạo thành viên -->
            <button class="btn btn-primary mb-4" @click="showCreateForm = !showCreateForm">
                Tạo thành viên
            </button>

            <!-- Form tạo thành viên mới -->
            <div v-if="showCreateForm" class="mb-4">
                <div class="form-group">
                    <label for="name">Tên</label>
                    <input v-model="newUser.name" type="text" class="form-control" id="name" placeholder="Nhập tên thành viên" />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input v-model="newUser.email" type="email" class="form-control" id="email" placeholder="Nhập email" />
                </div>
                <div class="form-group">
                    <label for="password">Mật khẩu</label>
                    <input v-model="newUser.password" type="password" class="form-control" id="password" placeholder="Nhập mật khẩu" />
                </div>
                <div class="form-group">
                    <label for="role">Vai trò</label>
                    <select v-model="newUser.role" class="form-control" id="role">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button class="btn btn-success mt-3" @click="createUser">Lưu thành viên</button>
            </div>

            <!-- Bảng hiển thị danh sách thành viên với Bootstrap -->
            <table class="table table-hover table-bordered table-striped">
                <thead class="thead-light">
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th> <!-- Thêm cột hành động -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.role }}</td>
                        <td>{{ user.created_at }}</td>
                        <td>
                            <!-- Nút sửa -->
                            <button class="btn btn-warning btn-sm me-2" @click="editUser(user)">
                                <i class="fas fa-edit"></i>
                            </button>

                            <!-- Nút xóa -->
                            <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </DefaultLayout>
</template>

<script>
    import DefaultLayout from './DefaultLayout.vue';
    import apiService from '@/apiService'; // Sử dụng apiService để gọi API
    import Swal from 'sweetalert2'; // Import SweetAlert2 để thông báo

    export default {
        name: "UserComponent", // Component quản lý thành viên
        components: {
            DefaultLayout
        },
        data() {
            return {
                users: [], // Mảng chứa danh sách người dùng
                showCreateForm: false, // Điều khiển hiển thị form tạo thành viên
                newUser: {
                    name: '',
                    email: '',
                    password: '',
                    role: 'user' // Giá trị mặc định của vai trò
                }
            };
        },
        async mounted() {
            this.loadUsers(); // Tải danh sách người dùng khi component được mount
        },
        methods: {
            // Tải danh sách người dùng
            async loadUsers() {
                try {
                    const users = await apiService.getUsers();
                    this.users = users; // Lưu danh sách người dùng vào mảng users
                } catch (error) {
                    console.error("Lỗi khi tải danh sách người dùng:", error);
                }
            },
            // Tạo thành viên mới
            async createUser() {
                try {
                    // Gọi API để tạo người dùng mới
                    await apiService.createUser(this.newUser);

                    // Sau khi tạo thành công, tải lại danh sách người dùng
                    this.loadUsers();

                    // Xóa thông tin form
                    this.newUser = {
                        name: '',
                        email: '',
                        password: '',
                        role: 'user'
                    };

                    // Ẩn form
                    this.showCreateForm = false;

                    // Thông báo thành công
                    Swal.fire({
                        title: 'Thành công!',
                        text: 'Thành viên đã được tạo thành công!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } catch (error) {
                    console.error("Lỗi khi tạo thành viên:", error);
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Có lỗi xảy ra khi tạo thành viên.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            },
            // Sửa thành viên
            editUser(user) {
                // Hiển thị thông tin user trong form để sửa
                this.showCreateForm = true;
                this.newUser = { ...user, password: '' }; // Sao chép thông tin user và không hiển thị mật khẩu
            },
            // Xóa thành viên
            async deleteUser(userId) {
                try {
                    const result = await Swal.fire({
                        title: 'Bạn có chắc chắn?',
                        text: 'Hành động này không thể hoàn tác!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Xóa',
                        cancelButtonText: 'Hủy'
                    });

                    if (result.isConfirmed) {
                        // Gọi API xóa người dùng
                        await apiService.deleteUser(userId);

                        // Cập nhật lại danh sách sau khi xóa
                        this.loadUsers();

                        Swal.fire({
                            title: 'Đã xóa!',
                            text: 'Người dùng đã được xóa.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                    }
                } catch (error) {
                    console.error("Lỗi khi xóa thành viên:", error);
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Có lỗi xảy ra khi xóa thành viên.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            }
        }
    };
</script>

<style scoped>
/* Không cần thêm quá nhiều CSS vì đã có các lớp của Bootstrap */
</style>
