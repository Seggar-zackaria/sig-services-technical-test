<script setup lang="ts">
import { ref, watch } from 'vue';
import Button from './Button.vue';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const searchQuery = ref(props.modelValue);
let timeout: ReturnType<typeof setTimeout>;

watch(searchQuery, (newVal) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('update:modelValue', newVal);
  }, 300);
});

watch(
  () => props.modelValue,
  (newVal) => {
    searchQuery.value = newVal;
  },
);
</script>

<template>
  <div class="relative w-full">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <input
      v-model="searchQuery"
      type="text"
      class="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm font-medium shadow-sm"
      :placeholder="placeholder || 'Rechercher...'"
    />
    <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
      <Button
        variant="ghost"
        size="sm"
        @click="searchQuery = ''"
        class="text-slate-400 hover:text-slate-600"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Button>
    </div>
  </div>
</template>
