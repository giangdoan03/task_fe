<template>
    <div class="wrapper">
        <AppSidebar />
        <div class="main">
            <AppNavbar />
            <!-- Nội dung động sẽ hiển thị tại đây -->
            <router-view />
            <AppFooter />
        </div>
    </div>
</template>

<script>
    import AppSidebar from './AppSidebar.vue';
    import AppNavbar from './AppNavbar.vue';
    import AppFooter from './AppFooter.vue';

    export default {
        name: "UserDashboard",
        components: {
            AppSidebar,
            AppNavbar,
            AppFooter
        }
    };
</script>
