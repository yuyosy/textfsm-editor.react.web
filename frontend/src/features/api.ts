import { envs } from '@/config/env';

const apiUrl = envs.API_ENTRYPOINT;

export const apiFetch = async (
  url: string,
  config: RequestInit = {},
  entrypoint: string = apiUrl
): Promise<any> => {
  try {
    const response = await fetch(`${entrypoint}${url}`, config);

    return await response.json();
  } catch (error) {
    // const message = error.message || 'Unknown error occurred';
    // console.error(message)
    return Promise.reject(error);
  }
};
export const api = {
  get: (url: string, config?: RequestInit, entrypoint?: string): Promise<any> => {
    return apiFetch(url, { ...config, method: 'GET' }, entrypoint);
  },
  post: (
    url: string,
    body: object | null,
    config?: RequestInit,
    entrypoint?: string
  ): Promise<any> => {
    return apiFetch(
      url,
      {
        ...config,
        method: 'POST',
        body: JSON.stringify(body),
      },
      entrypoint
    );
  },
  put: (
    url: string,
    body: object | null,
    config?: RequestInit,
    entrypoint?: string
  ): Promise<any> => {
    return apiFetch(
      url,
      {
        ...config,
        method: 'PUT',
        body: JSON.stringify(body),
      },
      entrypoint
    );
  },
  delete: (url: string, config?: RequestInit, entrypoint?: string): Promise<any> => {
    return apiFetch(url, { ...config, method: 'DELETE' }, entrypoint);
  },
};
