<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import Button from './Button.vue';

interface Props {
  modelValue: boolean;
  title?: string;
  maxWidth?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  maxWidth: 'max-w-2xl',
});

const emit = defineEmits(['update:modelValue', 'close']);

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    close();
  }
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  },
);

onMounted(() => document.addEventListener('keydown', handleEscape));
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="close"></div>

        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="modelValue"
            class="relative w-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            :class="maxWidth"
          >
            <!-- Header -->
            <div
              class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10"
            >
              <h3 v-if="title" class="text-xl font-bold text-slate-800">{{ title }}</h3>
              <slot name="header"></slot>

              <Button
                variant="ghost"
                size="sm"
                @click="close"
                class="rounded-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-auto"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>

            <!-- Body -->
            <div class="p-8 overflow-y-auto custom-scrollbar">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="px-8 py-4 bg-slate-50 border-t border-slate-100">
              <slot name="footer"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
</style>
