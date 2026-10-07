import axios, {
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  clearTokens,
  getAccessToken,
  saveAccessToken,
} from '../auth/tokenStorage';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const refreshClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<{ accessToken: string }>('/refresh')
      .then(({ data }) => {
        if (!data.accessToken) throw new Error('Missing access token');
        saveAccessToken(data.accessToken);
        return data.accessToken;
      })
      .catch((error: unknown) => {
        clearTokens();
        window.dispatchEvent(new Event('auth:expired'));
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetriableRequestConfig | undefined;
    const requestUrl = request?.url ?? '';
    const isAuthRequest = /\/(login|refresh)$/.test(requestUrl);

    if (
      error.response?.status !== 401 ||
      !request ||
      request._retry ||
      isAuthRequest
    ) {
      throw error;
    }

    request._retry = true;
    const accessToken = await refreshAccessToken();
    request.headers.Authorization = `Bearer ${accessToken}`;
    return apiClient.request(request);
  },
);

export const api = async <T>(
  path: string,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const response = await apiClient.request<T>({
    url: path,
    ...options,
  });

  return response.data;
};
