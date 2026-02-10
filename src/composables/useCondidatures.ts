import { ref } from 'vue';
import { api } from '../utils/fetch';
import type { Candidature } from '../types/interfaces';

export function useCandidatures() {
  const data = ref<Candidature[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchAll = async (filters?: Record<string, string>) => {
    loading.value = true;
    error.value = null;
    try {
      const { q, skill, sort, ...apiFilters } = filters || {};
      const params: Record<string, string> = { ...apiFilters };

      if (sort) {
        const [sortField] = sort.split(':');
        if (sortField) params._sort = sortField;
      }

      let result = await api.get<Candidature[]>('/candidatures', params);

      if (q && q.trim()) {
        const query = q.toLowerCase();
        result = result.filter((candidate) =>
          JSON.stringify(candidate).toLowerCase().includes(query),
        );
      }

      // Filter by skill
      if (skill && skill.trim()) {
        const skillQuery = skill.toLowerCase();
        result = result.filter((candidate) =>
          candidate.competences.some((c) => c.toLowerCase().includes(skillQuery)),
        );
      }

      data.value = result;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch candidatures';
    } finally {
      loading.value = false;
    }
  };

  const fetchOne = async (id: number): Promise<Candidature | null> => {
    loading.value = true;
    error.value = null;
    try {
      const result = await api.get<Candidature[]>(`/candidatures?id=${id}`);
      return result[0] || null;
    } catch (err: any) {
      error.value = err.message || `Failed to fetch candidature ${id}`;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateStatus = async (id: number, status: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    try {
      await api.patch<Candidature>(`/candidatures/${id}`, { statut: status });
      return true;
    } catch (err: any) {
      error.value = err.message || `Failed to update status for candidature ${id}`;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteCandidature = async (id: number): Promise<boolean> => {
    loading.value = true;
    error.value = null;
    try {
      await api.delete<void>(`/candidatures/${id}`);
      data.value = data.value.filter((c) => c.id !== id);
      return true;
    } catch (err: any) {
      error.value = err.message || `Failed to delete candidature ${id}`;
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    error,
    fetchAll,
    fetchOne,
    updateStatus,
    deleteCandidature,
  };
}
