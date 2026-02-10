import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { useError } from './composables/useError';

const app = createApp(App);

app.config.errorHandler = (err: any) => {
  const { notify } = useError();
  notify(err.message || 'An unexpected error occurred', 'error');
  console.error(err);
};

app.use(router);
app.mount('#app');
