import { api } from '../apiClient';

export const passwordResetApi = {
  request: (data: { email: string; captchaToken: string }) =>
    api<{ message: string }>('/password-reset/request', {
      method: 'POST',
      data,
    }),
  confirm: (data: { token: string; newPassword: string }) =>
    api<void>('/password-reset/confirm', { method: 'POST', data }),
};
