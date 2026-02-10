<script setup lang="ts">
import { computed } from 'vue';

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  modelValue: string | number | undefined;
  options: Option[];
  placeholder?: string;
  label?: string;
  allLabel?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'change']);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
    emit('change', val);
  },
});
</script>

<template>
  <div class="relative min-w-[200px]">
    <label v-if="label" class="block text-sm font-medium text-slate-700 mb-1">
      {{ label }}
    </label>
    <div class="relative">
      <select
        v-model="value"
        class="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer font-medium text-sm"
      >
        <option v-if="placeholder" :value="undefined" disabled selected>
          {{ placeholder }}
        </option>
        <option value="">{{ allLabel || 'Tout afficher' }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>
