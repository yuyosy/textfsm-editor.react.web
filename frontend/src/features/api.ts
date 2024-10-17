import { envs } from '@/config/env';

const apiUrl = envs.API_ENTRYPOINT;
class APIRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIRequestError';
  }
}
export const apiFetch = async (
  url: string,
  config: RequestInit = {},
  entrypoint: string = apiUrl,
  timeout: number = 5000
): Promise<any> => {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new APIRequestError('Request timed out')), timeout)
  );

  try {
    const response = await Promise.race([
      fetch(`${entrypoint}${url}`, config),
      timeoutPromise,
    ]);
    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return Promise.reject(new APIRequestError(message));
  }
};
export const api = {
  get: (
    url: string,
    config?: RequestInit,
    entrypoint?: string,
    timeout?: number
  ): Promise<any> => {
    return apiFetch(url, { ...config, method: 'GET' }, entrypoint, timeout);
  },
  post: (
    url: string,
    body: object | null,
    config?: RequestInit,
    entrypoint?: string,
    timeout?: number
  ): Promise<any> => {
    return apiFetch(
      url,
      {
        ...config,
        method: 'POST',
        body: JSON.stringify(body),
      },
      entrypoint,
      timeout
    );
  },
  put: (
    url: string,
    body: object | null,
    config?: RequestInit,
    entrypoint?: string,
    timeout?: number
  ): Promise<any> => {
    return apiFetch(
      url,
      {
        ...config,
        method: 'PUT',
        body: JSON.stringify(body),
      },
      entrypoint,
      timeout
    );
  },
  delete: (
    url: string,
    config?: RequestInit,
    entrypoint?: string,
    timeout?: number
  ): Promise<any> => {
    return apiFetch(url, { ...config, method: 'DELETE' }, entrypoint, timeout);
  },
};
