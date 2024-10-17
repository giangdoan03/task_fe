import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "@/components/LoginForm.vue";
import UserDashboard from "@/components/UserDashboard.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: LoginForm,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: UserDashboard,
    meta: { requiresAuth: true }, // Đặt meta requiresAuth để chỉ định cần xác thực
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard để kiểm tra xem có cần xác thực không
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Kiểm tra token từ localStorage

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Nếu chưa xác thực và route yêu cầu xác thực, chuyển hướng về login
      next({ name: "Login" });
    } else {
      next(); // Nếu đã xác thực, tiếp tục điều hướng
    }
  } else {
    next(); // Nếu route không yêu cầu xác thực, tiếp tục điều hướng
  }
});

export default router;
