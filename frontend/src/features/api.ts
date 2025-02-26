import { envs } from '@/config/env';

const apiUrl = envs.API_ENTRYPOINT;
class APIRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIRequestError';
  }
}

type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';

export const apiFetch = async (
  url: string,
  config: RequestInit = {},
  entrypoint: string = apiUrl,
  timeout: number = 5000,
  responseType: ResponseType = 'json'
): Promise<any> => {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new APIRequestError('Request timed out')), timeout)
  );

  try {
    const response = await Promise.race([
      fetch(`${entrypoint}${url}`, config),
      timeoutPromise,
    ]);

    switch (responseType) {
      case 'json':
        return await response.json();
      case 'text':
        return await response.text();
      case 'blob':
        return await response.blob();
      case 'arrayBuffer':
        return await response.arrayBuffer();
      case 'formData':
        return await response.formData();
      default:
        throw new APIRequestError('Unsupported response type');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return Promise.reject(new APIRequestError(message));
  }
};

type APIOptions = {
  config?: RequestInit;
  entrypoint?: string;
  timeout?: number;
  responseType?: ResponseType;
};

export const api = {
  get: (
    url: string,
    { config, entrypoint, timeout, responseType }: APIOptions = {}
  ): Promise<any> => {
    return apiFetch(
      url,
      { ...config, method: 'GET' },
      entrypoint,
      timeout,
      responseType
    );
  },
  post: (
    url: string,
    body: object | null,
    { config, entrypoint, timeout, responseType }: APIOptions = {}
  ): Promise<any> => {
    return apiFetch(
      url,
      {
        ...config,
        method: 'POST',
        body: JSON.stringify(body),
      },
      entrypoint,
      timeout,
      responseType
    );
  },
  put: (
    url: string,
    body: object | null,
    { config, entrypoint, timeout, responseType }: APIOptions = {}
  ): Promise<any> => {
    return apiFetch(
      url,
      {
        ...config,
        method: 'PUT',
        body: JSON.stringify(body),
      },
      entrypoint,
      timeout,
      responseType
    );
  },
  delete: (
    url: string,
    { config, entrypoint, timeout, responseType }: APIOptions = {}
  ): Promise<any> => {
    return apiFetch(
      url,
      { ...config, method: 'DELETE' },
      entrypoint,
      timeout,
      responseType
    );
  },
};
