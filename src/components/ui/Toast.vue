<script setup lang="ts">
import { useError } from '../../composables/useError';

const { errors, remove } = useError();
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-x-full opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-full opacity-0"
    >
      <div
        v-for="error in errors"
        :key="error.id"
        class="pointer-events-auto bg-white border border-slate-100 shadow-xl rounded-xl p-4 flex items-start gap-3 transform"
        :class="{
          'border-l-4 border-l-red-500': error.type === 'error',
          'border-l-4 border-l-amber-500': error.type === 'warning',
          'border-l-4 border-l-blue-500': error.type === 'info',
          'border-l-4 border-l-green-500': error.type === 'success',
        }"
      >
        <div class="shrink-0 mt-0.5">
          <svg
            v-if="error.type === 'error'"
            class="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <svg
            v-else-if="error.type === 'warning'"
            class="w-5 h-5 text-amber-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <svg
            v-else-if="error.type === 'success'"
            class="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-800">
            {{
              error.type === 'error'
                ? 'Erreur'
                : error.type === 'warning'
                  ? 'Attention'
                  : error.type === 'success'
                    ? 'Succès'
                    : 'Info'
            }}
          </p>
          <p class="text-sm text-slate-500 mt-0.5 wrap-break-word">{{ error.message }}</p>
        </div>

        <button
          @click="remove(error.id)"
          class="shrink-0 ml-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
