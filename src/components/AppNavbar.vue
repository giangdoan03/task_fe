<template>
    <nav class="navbar navbar-expand navbar-light navbar-bg">
        <a class="sidebar-toggle js-sidebar-toggle">
            <i class="hamburger align-self-center"></i>
        </a>

        <div class="navbar-collapse collapse">
            <ul class="navbar-nav navbar-align">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle d-none d-sm-inline-block" href="#" data-bs-toggle="dropdown">
                        <img src="../assets/img/avatar.png" class="avatar img-fluid rounded me-1" alt="Charles Hall"/>
                        <span class="text-dark">Charles Hall</span>
                    </a>
                    <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="pages-profile.html"><i class="align-middle me-1"
                                                                              data-feather="user"></i>
                            Profile</a>
                        <a class="dropdown-item" href="#"><i class="align-middle me-1" data-feather="pie-chart"></i>
                            Analytics</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="index.html"><i class="align-middle me-1"
                                                                      data-feather="settings"></i>
                            Settings & Privacy</a>
                        <a class="dropdown-item" href="#"><i class="align-middle me-1" data-feather="help-circle"></i>
                            Help
                            Center</a>
                        <div class="dropdown-divider"></div>
                        <!-- Thêm sự kiện @click cho đăng xuất -->
                        <a class="dropdown-item" href="#" @click="logout">Log out</a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
export default {
    name: "AppNavbar",
    methods: {
        logout() {
            // Xóa token từ localStorage hoặc cookie
            localStorage.removeItem('token'); // Xóa token sau khi logout

            // Phát sự kiện để quay về form login
            this.$router.push('/'); // Quay về trang login (gốc)
        }
    }
};
</script>

<style scoped>
.navbar {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: .875rem 1.375rem;
    position: relative;
}

.dropdown-toggle::after {
    display: inline-block;
    margin-left: .255em;
    vertical-align: .255em;
    content: "";
    border-top: .3em solid;
    border-right: .3em solid transparent;
    border-bottom: 0;
    border-left: .3em solid transparent;
    border: solid;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 2px;
    transform: rotate(45deg);
}
</style>
