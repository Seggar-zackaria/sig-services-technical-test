import { ref } from 'vue';

interface ErrorNotification {
  id: number;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
}

const errors = ref<ErrorNotification[]>([]);
let nextId = 1;

export function useError() {
  const notify = (message: string, type: 'error' | 'warning' | 'info' | 'success' = 'error') => {
    const id = nextId++;
    const error = { id, message, type };
    errors.value.push(error);

    // Auto-remove
    setTimeout(() => {
      remove(id);
    }, 5000);
  };

  const remove = (id: number) => {
    errors.value = errors.value.filter((e) => e.id !== id);
  };

  return {
    errors,
    notify,
    remove,
  };
}
