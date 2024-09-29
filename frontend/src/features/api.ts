import { envs } from '../config/env';

const apiUrl = envs.API_ENTRYPOINT;

export const apiFetch = async (url: string, config: RequestInit = {}) => {
  try {
    const response = await fetch(`${apiUrl}${url}`, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || response.statusText);
    }

    return await response.json();
  } catch (error) {
    // const message = error.message || 'Unknown error occurred';
    // console.error(message)
    return Promise.reject(error);
  }
};

export const api = {
  get: (url: string, config?: RequestInit) => {
    return apiFetch(url, { ...config, method: 'GET' });
  },
  post: (url: string, body: BodyInit | null, config?: RequestInit) => {
    return apiFetch(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  put: (url: string, body: BodyInit | null, config?: RequestInit) => {
    return apiFetch(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },
  delete: (url: string, config?: RequestInit) => {
    return apiFetch(url, { ...config, method: 'DELETE' });
  },
};
