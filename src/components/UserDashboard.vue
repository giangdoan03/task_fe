<template>
    <div class="wrapper">
      <AppSidebar />
      <div class="main">
        <AppNavbar />
        <MainContent />
        <AppFooter />
      </div>
    </div>
  </template>

<script>
import AppSidebar from './AppSidebar.vue';
import AppNavbar from './AppNavbar.vue';
import MainContent from './MainContent.vue';
import AppFooter from './AppFooter.vue';

export default {
    name: "UserDashboard",
    components: {
        AppSidebar,
        AppNavbar,
        MainContent,
        AppFooter
    }
};
</script>

<style scoped>
/* Add your custom styles here */
</style>