import { useError } from '../composables/useError';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const buildQuerySstring = (params?: Record<string, string | number | boolean | undefined>) => {
  if (!params) return '';

  const q = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      q.append(key, String(value));
    }
  });
  const queryString = q.toString();
  return queryString ? `?${queryString}` : '';
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { headers, ...rest } = options;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  };

  const fullUrl = `${baseUrl}${endpoint}`;
  console.log(`Making request to: ${fullUrl}`, options);

  const res = await fetch(fullUrl, {
    headers: defaultHeaders,
    ...rest,
  });

  console.log(res);

  if (!res.ok) {
    const errorBody = await res.text();
    const errorMessage = `API Error (${res.status}): ${res.statusText}. ${errorBody}`;

    // Notify global error handler
    const { notify } = useError();
    notify(errorMessage, 'error');

    throw new Error(errorMessage);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

export const api = {
  get: <T>(url: string, params?: Record<string, string>) => {
    return request<T>(`${url}${buildQuerySstring(params)}`, {
      method: 'GET',
    });
  },

  post: <T>(url: string, body: string) => {
    return request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  patch: <T>(url: string, body: any) => {
    return request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete: <T>(url: string) => {
    return request<T>(url, {
      method: 'DELETE',
    });
  },
};
