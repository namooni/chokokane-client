import { api } from '../apiClient';

export type CurrentUser = {
  id: number;
  name: string;
  email: string;
};

export const userApi = {
  getMe: (signal?: AbortSignal) => api<CurrentUser>('/me', { signal }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api<void>('/me/password', { method: 'PATCH', data }),
  deleteAccount: (data: { password: string }) =>
    api<void>('/me', { method: 'DELETE', data }),
};
