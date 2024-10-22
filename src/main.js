import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Import router

import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap CSS
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

// Tạo và gắn ứng dụng Vue với router
createApp(App)
  .use(router)  // Sử dụng router
  .mount('#app');
