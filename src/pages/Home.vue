<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import CandidateCard from '../components/ui/Card.vue';
import CardSkeleton from '../components/ui/CardSkeleton.vue';
import Button from '../components/ui/Button.vue';
import Select from '../components/ui/Select.vue';
import SearchBar from '../components/ui/SearchBar.vue';
import CandidateModal from '../components/candidature/CandidateModal.vue';
import { useCandidatures } from '../composables/useCondidatures';
import { useError } from '../composables/useError';

const { data, loading, error, fetchAll, deleteCandidature } = useCandidatures();
const { notify } = useError();

const selectedStatus = ref('');
const searchQuery = ref('');
const selectedCandidateId = ref<number | null>(null);
const isModalOpen = ref(false);

const statusOptions = [
  { label: 'En attente', value: 'En attente' },
  { label: 'Entretien RH', value: 'Entretien RH' },
  { label: 'Entretien technique', value: 'Entretien technique' },
  { label: 'Accepté', value: 'Accepté' },
  { label: 'Refusé', value: 'Refusé' },
];

const selectedSkill = ref('');

const skillOptions = [
  { label: 'Vue.js', value: 'Vue.js' },
  { label: 'React', value: 'React' },
  { label: 'Angular', value: 'Angular' },
  { label: 'Node.js', value: 'Node.js' },
  { label: 'TypeScript', value: 'TypeScript' },
  { label: 'PHP', value: 'PHP' },
  { label: 'Laravel', value: 'Laravel' },
];

const openModal = (id: number) => {
  selectedCandidateId.value = id;
  isModalOpen.value = true;
};

const handleDelete = async (id: number) => {
  const success = await deleteCandidature(id);
  if (success) {
    notify('Candidature supprimée avec succès', 'success');
  }
};

const fetchData = () => {
  const filters: Record<string, string> = {};
  if (selectedStatus.value) filters.statut = selectedStatus.value;
  if (searchQuery.value) filters.q = searchQuery.value;
  if (selectedSkill.value) filters.skill = selectedSkill.value;
  fetchAll(filters);
};

watch([selectedStatus, searchQuery, selectedSkill], () => {
  fetchData();
});

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
    <!-- Header Section -->
    <div class="gap-6 mb-10">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">
          {{ data.length }} Candidatures
        </h1>
        <p class="text-slate-500 mt-1">Gérez et suivez les profils de candidats.</p>
      </div>

      <div
        class="flex lg:justify-end flex-col mt-8 sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto"
      >
        <div class="w-full sm:w-64">
          <SearchBar v-model="searchQuery" placeholder="Rechercher un candidat..." />
        </div>

        <Select
          v-model="selectedStatus"
          :options="statusOptions"
          placeholder="Filtrer par statut"
          all-label="Tous les statuts"
          class="w-full sm:w-48"
        />

        <Select
          v-model="selectedSkill"
          :options="skillOptions"
          placeholder="Filtrer par compétence"
          all-label="Toutes les compétences"
          class="w-full sm:w-48"
        />

        <Button
          variant="outline"
          size="sm"
          :loading="loading"
          @click="fetchData"
          title="Actualiser la liste"
          class="h-[42px] text-center"
        >
          <svg class="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
        </Button>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <CardSkeleton v-for="n in 6" :key="n" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="bg-red-50 p-4 rounded-full text-red-500 mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-slate-800 mb-2">Une erreur est survenue</h3>
      <p class="text-slate-500 mb-6 max-w-md">{{ error }}</p>
      <Button variant="primary" @click="fetchAll">Réessayer</Button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="data.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-4xl bg-slate-50/50"
    >
      <div class="bg-white p-4 rounded-full text-slate-400 mb-4 shadow-sm border border-slate-100">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          ></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-slate-800 mb-2">Aucune candidature</h3>
      <p class="text-slate-500 mb-6">Il n'y a pas encore de candidatures à afficher.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
      <TransitionGroup name="list" appear>
        <CandidateCard
          v-for="item in data"
          :key="item.id"
          :candidature="item"
          @view="openModal(item.id)"
          @delete="handleDelete(item.id)"
        />
      </TransitionGroup>
    </div>

    <CandidateModal v-model="isModalOpen" :candidate-id="selectedCandidateId" />
  </div>
</template>
<style scoped>
.gap-6 {
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.list-enter-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.list-leave-active {
  transition: all 0.4s ease-in;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Stagger effect for list items */
.list-enter-active {
  transition-delay: calc(var(--i, 0) * 0.08s);
}

.list-move {
  transition: transform 0.5s ease;
}
</style>
