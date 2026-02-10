<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import type { Candidature } from '../../types/interfaces';
import { formatDate, avatarFallbackName, getStatusColor } from '../../utils/utils';
import Button from './Button.vue';

type CandidatureProps = Pick<
  Candidature,
  | 'id'
  | 'nom'
  | 'poste'
  | 'statut'
  | 'dateCandidature'
  | 'email'
  | 'telephone'
  | 'cv'
  | 'lettreMotivation'
>;

const props = defineProps<{
  candidature: CandidatureProps;
}>();

const emit = defineEmits(['view', 'delete']);

const showDropdown = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const closeDropdown = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});

const statusColor = computed(() => getStatusColor(props.candidature.statut));

const formatedDate = computed(() => formatDate(props.candidature.dateCandidature));
const nameFallback = computed(() => avatarFallbackName(props.candidature.nom));
</script>

<template>
  <div
    class="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col items-center w-full mx-auto group relative overflow-visible"
  >
    <div
      class="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-slate-50 to-transparent -z-10 rounded-t-xl"
    ></div>

    <div class="mb-4 relative">
      <div
        class="size-24 rounded-full bg-white text-slate-600 flex items-center justify-center font-bold text-3xl shadow-sm border-4 border-white ring-1 ring-slate-100"
      >
        {{ nameFallback }}
      </div>
      <div
        class="absolute bottom-1 right-1 size-5 rounded-full border-4 border-white"
        :style="{ backgroundColor: statusColor }"
        :title="candidature.statut"
      ></div>
    </div>

    <h3 class="text-xl font-bold text-slate-800 mb-1">{{ candidature.nom }}</h3>
    <p class="text-sm font-medium text-slate-400 mb-4">{{ candidature.poste }}</p>

    <p class="text-sm text-slate-500 mb-6 text-center leading-relaxed px-2 line-clamp-3">
      {{ candidature.lettreMotivation }}
    </p>

    <div class="w-full flex flex-col gap-0 mb-8">
      <div
        class="flex items-center justify-between py-3 border-b border-dashed border-slate-100 last:border-0"
      >
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-blue-50 text-blue-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <span class="text-sm font-medium text-slate-500">Date</span>
        </div>
        <span class="text-sm font-bold text-slate-700">{{ formatedDate }}</span>
      </div>

      <div
        class="flex items-center justify-between py-3 border-b border-dashed border-slate-100 last:border-0"
      >
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-sky-50 text-sky-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              ></path>
            </svg>
          </div>
          <span class="text-sm font-medium text-slate-500">Email</span>
        </div>
        <a
          :href="`mailto:${candidature.email}`"
          class="text-sm font-bold text-slate-700 truncate max-w-[140px]"
          :title="candidature.email"
        >
          {{ candidature.email || '-' }}
        </a>
      </div>

      <div
        class="flex items-center justify-between py-3 border-b border-dashed border-slate-100 last:border-0"
      >
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-indigo-50 text-indigo-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              ></path>
            </svg>
          </div>
          <span class="text-sm font-medium text-slate-500">Tel</span>
        </div>
        <a
          :href="`tel:${candidature.telephone}`"
          class="text-sm font-bold text-slate-700 hover:text-blue-500 transition-colors"
        >
          {{ candidature.telephone || '-' }}
        </a>
      </div>
      <div
        class="flex items-center justify-between py-3 border-b border-dashed border-slate-100 last:border-0"
      >
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-emerald-50 text-emerald-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <span class="text-sm font-medium text-slate-500">Statut</span>
        </div>
        <span
          class="text-xs font-bold px-2 py-1 rounded-full border bg-white"
          :style="{ color: statusColor, borderColor: statusColor }"
        >
          {{ candidature.statut }}
        </span>
      </div>
    </div>

    <!-- Footer Buttons -->
    <div class="w-full flex gap-3 mt-auto">
      <Button
        variant="outline"
        @click="emit('view')"
        class="flex-1 py-2.5 px-4 rounded-[14px] border-sky-500 text-sky-500 font-bold hover:bg-sky-500 hover:text-white transition-all duration-300 text-sm flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 5 8.268 7.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          ></path>
        </svg>
        Voir profil
      </Button>

      <div class="relative" ref="dropdownRef">
        <Button
          variant="outline"
          @click.stop="toggleDropdown"
          class="p-2.5! rounded-[14px] border-slate-100 text-slate-400 hover:border-sky-500 hover:text-sky-500 transition-all duration-300 flex items-center justify-center aspect-square"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </Button>

        <!-- Dropdown Menu -->
        <div
          v-if="showDropdown"
          class="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20 origin-bottom-right"
        >
          <Button
            variant="ghost"
            class="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium justify-start rounded-none"
            @click.stop="$emit('delete')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
