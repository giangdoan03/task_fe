import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Import router
import { createPinia } from 'pinia';  // Import Pinia

import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap CSS
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

const pinia = createPinia();  // Khởi tạo Pinia

// Tạo và gắn ứng dụng Vue với Pinia và router
createApp(App)
  .use(pinia)  // Sử dụng Pinia trước khi sử dụng store
  .use(router)  // Sử dụng router
  .mount('#app');
