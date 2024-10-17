import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Import router

import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap CSS

// Tạo và gắn ứng dụng Vue với router
createApp(App)
  .use(router)  // Sử dụng router
  .mount('#app');
