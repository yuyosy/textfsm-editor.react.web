import { envs } from '@/config/env';

const apiUrl = envs.API_ENTRYPOINT;
class APIRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIRequestError';
  }
}

type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';

type ResponseTypeMap = {
  json: unknown;
  text: string;
  blob: Blob;
  arrayBuffer: ArrayBuffer;
  formData: FormData;
};

export const apiFetch = async <T extends ResponseType = 'json'>(
  url: string,
  config: RequestInit = {},
  entrypoint: string = apiUrl,
  timeout: number = 5000,
  responseType: T = 'json' as T,
): Promise<ResponseTypeMap[T]> => {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new APIRequestError('Request timed out')), timeout),
  );

  try {
    const response = await Promise.race([
      fetch(`${entrypoint}${url}`, config),
      timeoutPromise,
    ]);

    switch (responseType) {
      case 'json':
        return (await response.json()) as ResponseTypeMap[T];
      case 'text':
        return (await response.text()) as ResponseTypeMap[T];
      case 'blob':
        return (await response.blob()) as ResponseTypeMap[T];
      case 'arrayBuffer':
        return (await response.arrayBuffer()) as ResponseTypeMap[T];
      case 'formData':
        return (await response.formData()) as ResponseTypeMap[T];
      default:
        throw new APIRequestError('Unsupported response type');
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return Promise.reject(new APIRequestError(message));
  }
};

type APIOptions<T extends ResponseType = 'json'> = {
  config?: RequestInit;
  entrypoint?: string;
  timeout?: number;
  responseType?: T;
};

export const api = {
  get: <T extends ResponseType = 'json'>(
    url: string,
    { config, entrypoint, timeout, responseType }: APIOptions<T> = {},
  ): Promise<ResponseTypeMap[T]> => {
    return apiFetch<T>(
      url,
      { ...config, method: 'GET' },
      entrypoint,
      timeout,
      responseType,
    );
  },
  post: <T extends ResponseType = 'json'>(
    url: string,
    body: object | null,
    { config, entrypoint, timeout, responseType }: APIOptions<T> = {},
  ): Promise<ResponseTypeMap[T]> => {
    return apiFetch<T>(
      url,
      {
        ...config,
        method: 'POST',
        body: JSON.stringify(body),
      },
      entrypoint,
      timeout,
      responseType,
    );
  },
  put: <T extends ResponseType = 'json'>(
    url: string,
    body: object | null,
    { config, entrypoint, timeout, responseType }: APIOptions<T> = {},
  ): Promise<ResponseTypeMap[T]> => {
    return apiFetch<T>(
      url,
      {
        ...config,
        method: 'PUT',
        body: JSON.stringify(body),
      },
      entrypoint,
      timeout,
      responseType,
    );
  },
  delete: <T extends ResponseType = 'json'>(
    url: string,
    { config, entrypoint, timeout, responseType }: APIOptions<T> = {},
  ): Promise<ResponseTypeMap[T]> => {
    return apiFetch<T>(
      url,
      { ...config, method: 'DELETE' },
      entrypoint,
      timeout,
      responseType,
    );
  },
};
