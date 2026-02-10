<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import Modal from '../ui/Modal.vue';
import Button from '../ui/Button.vue';
import Select from '../ui/Select.vue';
import { useCandidatures } from '../../composables/useCondidatures';
import { useError } from '../../composables/useError';
import type { Candidature } from '../../types/interfaces';
import { formatDate, avatarFallbackName, formatCurrency, getStatusColor } from '../../utils/utils';

interface Props {
  modelValue: boolean;
  candidateId: number | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'close']);

const { fetchOne, updateStatus, loading, error } = useCandidatures();
const { notify } = useError();
const candidate = ref<Candidature | null>(null);
const isEditingStatus = ref(false);

const statusOptions = [
  { label: 'En attente', value: 'En attente' },
  { label: 'Entretien RH', value: 'Entretien RH' },
  { label: 'Entretien technique', value: 'Entretien technique' },
  { label: 'Accepté', value: 'Accepté' },
  { label: 'Refusé', value: 'Refusé' },
];

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const loadCandidate = async () => {
  if (props.candidateId) {
    candidate.value = await fetchOne(props.candidateId);
  } else {
    candidate.value = null;
  }
};

const handleStatusUpdate = async (newStatus: string | number) => {
  if (!candidate.value || !newStatus) return;
  const success = await updateStatus(candidate.value.id, String(newStatus));
  if (success) {
    candidate.value.statut = String(newStatus);
    isEditingStatus.value = false;
    notify('Statut mis à jour avec succès', 'success');
  }
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      loadCandidate();
      isEditingStatus.value = false;
    } else {
      setTimeout(() => {
        candidate.value = null;
      }, 300);
    }
  },
);

const statusColor = computed(() => {
  if (!candidate.value) return '#6b7280';
  return getStatusColor(candidate.value.statut);
});

const nameFallback = computed(() =>
  candidate.value ? avatarFallbackName(candidate.value.nom) : '',
);
</script>

<template>
  <Modal v-model="isOpen" @close="$emit('close')">
    <template #header>
      <div class="flex items-center gap-3" v-if="candidate">
        <h2 class="text-xl font-bold text-slate-800">Détails de la candidature</h2>

        <div v-if="!isEditingStatus" class="flex items-center gap-2">
          <span
            class="px-3 py-1 rounded-full text-xs font-semibold border transition-colors duration-300"
            :style="{
              color: statusColor,
              borderColor: statusColor,
              backgroundColor: '#ffffff',
            }"
          >
            {{ candidate.statut }}
          </span>
          <Button
            variant="ghost"
            size="sm"
            @click="isEditingStatus = true"
            class="p-1 rounded-full text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
            title="Modifier le statut"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </Button>
        </div>

        <div v-else class="min-w-[200px]">
          <Select
            :model-value="candidate.statut"
            :options="statusOptions"
            placeholder="Changer le statut"
            @update:model-value="handleStatusUpdate"
            class="w-full"
          />
        </div>
      </div>
      <div v-else class="h-6 w-32 bg-slate-100 rounded animate-pulse"></div>
    </template>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p class="text-slate-500">Chargement du profil...</p>
    </div>

    <div v-else-if="error" class="text-center py-10 text-red-500">
      <p>{{ error }}</p>
      <Button variant="secondary" @click="loadCandidate" class="mt-4">Réessayer</Button>
    </div>

    <div v-else-if="candidate" class="space-y-8">
      <!-- Profile Header -->
      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div
          class="size-24 rounded-full bg-white text-slate-600 flex items-center justify-center font-bold text-3xl shadow-sm border-4 border-white ring-1 ring-slate-100"
        >
          {{ nameFallback }}
        </div>
        <div class="text-center sm:text-left flex-1">
          <h3 class="text-2xl font-bold text-slate-900">{{ candidate.nom }}</h3>
          <p class="text-lg text-slate-500">{{ candidate.poste }}</p>
          <div class="mt-3 flex flex-wrap justify-center sm:justify-start gap-3">
            <a
              :href="`mailto:${candidate.email}`"
              class="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"
            >
              <svg
                class="size-4 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              {{ candidate.email }}
            </a>
            <a
              :href="`tel:${candidate.telephone}`"
              class="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"
            >
              <svg
                class="size-4 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                ></path>
              </svg>
              {{ candidate.telephone }}
            </a>
            <div
              class="inline-flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"
            >
              <svg
                class="size-4 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              {{ candidate.localisation }}
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Left Column -->
        <div class="space-y-6">
          <div class="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
            <h4 class="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-3">
              Informations Clés
            </h4>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">Expérience</span>
                <span class="font-semibold text-slate-800">{{ candidate.experience }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">Disponibilité</span>
                <span class="font-semibold text-slate-800">{{ candidate.disponibilite }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">Salaire souhaité</span>
                <span class="font-semibold text-slate-800">{{
                  formatCurrency(candidate.salaireSouhaite)
                }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">Date de candidature</span>
                <span class="font-semibold text-slate-800">{{
                  formatDate(candidate.dateCandidature)
                }}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-lg font-bold text-slate-800 mb-3">Lettre de motivation</h4>
            <div
              class="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-slate-600 text-sm leading-relaxed italic relative"
            >
              <span class="absolute top-2 left-2 text-4xl text-slate-200 font-serif">"</span>
              <p class="relative z-10 px-2">{{ candidate.lettreMotivation }}</p>
              <span class="absolute bottom-[-10px] right-4 text-4xl text-slate-200 font-serif"
                >"</span
              >
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <div>
            <h4 class="text-lg font-bold text-slate-800 mb-3">Compétences</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in candidate.competences"
                :key="tag"
                class="px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-slate-600 text-sm font-medium transition-shadow"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <div v-if="candidate.commentaires.length > 0">
            <h4 class="text-lg font-bold text-slate-800 mb-3">Gérer Historique</h4>
            <div
              class="space-y-3 relative before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-slate-200"
            >
              <div
                v-for="comment in candidate.commentaires"
                :key="comment.id"
                class="relative pl-8"
              >
                <div
                  class="absolute left-1.5 top-1.5 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white"
                ></div>
                <div class="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <div class="flex justify-between items-start mb-1">
                    <span class="font-bold text-slate-700 text-sm">{{ comment.auteur }}</span>
                    <span class="text-xs text-slate-400">{{ formatDate(comment.date) }}</span>
                  </div>
                  <p class="text-slate-600 text-sm">{{ comment.contenu }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-4">
        <a
          :href="candidate.cv"
          target="_blank"
          class="inline-flex items-center gap-2 border border-blue-500 bg-white text-blue-500 px-5 py-2.5 hover:bg-blue-500 hover:text-white transition-colors duration-300 rounded-xl font-semibold"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          Télécharger le CV
        </a>
      </div>
    </div>
  </Modal>
</template>
