<script setup lang="ts">
import Button from '../components/ui/Button.vue';
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
    <div class="mb-6 text-6xl font-extrabold text-slate-400">404</div>

    <h1 class="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">Page non trouvée</h1>
    <p class="text-slate-500 mb-8 max-w-md">
      Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
    </p>

    <router-link to="/">
      <Button variant="primary" class="gap-2 px-6 py-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
        Retour à l'accueil
      </Button>
    </router-link>
  </div>
</template>
