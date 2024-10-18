import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "@/components/LoginForm.vue";
import UserDashboard from "@/components/UserDashboard.vue";
import MainContent from "@/components/MainContent.vue";
import TaskComponent from "@/components/TaskComponent.vue";
import NewTaskComponent from '@/components/NewTaskComponent.vue';
import TaskDetailComponent from '@/components/TaskDetailComponent.vue';

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
    meta: { requiresAuth: true },
    children: [
      {
        path: "", // Đường dẫn mặc định khi vào "/dashboard"
        name: "MainContent",
        component: MainContent,
      },
    ],
  },
  {
    path: "/tasks", // Route riêng biệt cho TaskComponent
    name: "Tasks",
    component: TaskComponent,
    meta: { requiresAuth: true }, // Yêu cầu xác thực cho tasks
  },
  {
    path: '/tasks/new', // Đường dẫn cho NewTaskComponent
    name: 'NewTask',
    component: NewTaskComponent,
    meta: { requiresAuth: true },
  },
  {
    path: '/tasks/:id', // Route cho chi tiết công việc
    name: 'TaskDetail',
    component: TaskDetailComponent,
    meta: { requiresAuth: true },
    props: true // Đảm bảo route nhận được `id` từ URL
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
