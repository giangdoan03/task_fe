<template>
    <nav id="sidebar" class="sidebar js-sidebar">
        <div class="sidebar-content js-simplebar">
            <router-link class="sidebar-brand" to="/dashboard">
                <span class="align-middle">AdminKit</span>
            </router-link>

            <ul class="sidebar-nav">
                <li class="sidebar-header">Pages</li>

                <!-- Dashboard -->
                <li class="sidebar-item">
                    <router-link
                            class="sidebar-link"
                            to="/dashboard"
                            active-class="active"
                            @click="closeSubMenuIfNeeded('dashboard')"
                    >
                        <i class="align-middle" data-feather="sliders"></i>
                        <span class="align-middle">Dashboard</span>
                    </router-link>
                </li>

                <!-- Công việc với menu con -->
                <li class="sidebar-item" :class="{ 'submenu-open': isOpen === 'tasks' }">
                    <a class="sidebar-link" href="#" @click="toggleSubMenu('tasks')">
                        <i class="align-middle" data-feather="package"></i>
                        <span class="align-middle">Công việc</span>
                        <i class="chevron" :class="{ 'rotate': isOpen === 'tasks' }"></i>
                    </a>
                    <ul v-if="isOpen === 'tasks'" class="submenu">
                        <li class="submenu-item">
                            <router-link class="sidebar-link" to="/tasks" active-class="active">
                                Danh sách công việc
                            </router-link>
                        </li>
                        <li class="submenu-item">
                            <router-link class="sidebar-link" to="/tasks/new" active-class="active">
                                Tạo công việc mới
                            </router-link>
                        </li>
                    </ul>
                </li>

                <li class="sidebar-item">
                    <router-link
                            class="sidebar-link"
                            to="/users"
                            active-class="active"
                            @click="closeSubMenuIfNeeded('users')"
                    >
                        <i class="align-middle" data-feather="user"></i>
                        <span class="align-middle">Thành viên</span>
                    </router-link>
                </li>

                <!-- Add other sidebar links here -->
            </ul>
        </div>
    </nav>
</template>

<script>
    export default {
        name: "AppSidebar",
        data() {
            return {
                isOpen: null, // Biến để kiểm soát menu con nào đang mở, lưu key của menu đang mở
            };
        },
        methods: {
            toggleSubMenu(menu) {
                // Chỉ mở/đóng menu con tương ứng và giữ nguyên nếu người dùng bấm vào menu con đang mở
                if (this.isOpen === menu) {
                    this.isOpen = null; // Đóng nếu menu con đã mở
                } else {
                    this.isOpen = menu; // Mở menu con mới
                }
            },
            closeSubMenuIfNeeded(parentMenu) {
                // Đóng menu con khi bấm vào menu cha khác
                if (this.isOpen && this.isOpen !== parentMenu) {
                    this.isOpen = null; // Đóng menu con hiện tại
                }
            }
        },
        mounted() {
            // Khởi tạo lại Feather Icons nếu cần
            if (window.feather) {
                window.feather.replace();
            }
        }
    };
</script>

<style scoped>
    /* Chỉ làm sáng chữ và biểu tượng khi route active */
    .sidebar-item .active {
        color: #e9ecef; /* Màu chữ trắng khi active */
    }

    .sidebar-item .active svg {
        color: #e9ecef;
    }

    /* Định dạng submenu */
    .submenu {
        list-style: none;
        padding-left: 20px;
        margin-top: 5px;
    }

    .submenu-item {
        margin-top: 5px;
    }

    .submenu-item .sidebar-link {
        color: #adb5bd; /* Màu chữ của submenu */
    }

    .submenu-item .sidebar-link.active {
        color: #e9ecef; /* Màu chữ khi submenu active */
    }

    /* Hiệu ứng xoay cho biểu tượng chevron khi mở submenu */
    .chevron {
        float: right;
        transition: transform 0.3s ease;
    }

    .rotate {
        transform: rotate(90deg);
    }

    /* Thêm một số khoảng cách khi submenu được mở */
    .submenu-open {
        margin-bottom: 10px;
    }
</style>
