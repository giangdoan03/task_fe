<template>
    <div class="wrapper">
        <AppSidebar />
        <div class="main">
            <AppNavbar />
            <div class="content">
                <!-- Sử dụng slot để hiển thị nội dung động -->
                <slot></slot>
            </div>
            <AppFooter />
        </div>
    </div>
</template>

<script>
    import AppSidebar from './AppSidebar.vue';
    import AppNavbar from './AppNavbar.vue';
    import AppFooter from './AppFooter.vue';

    export default {
        name: "DefaultLayout",
        components: {
            AppSidebar,
            AppNavbar,
            AppFooter
        }
    };
</script>

<style scoped>
    /* Add your custom styles here */
</style>
