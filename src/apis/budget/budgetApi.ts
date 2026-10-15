import { api } from '../apiClient';

export const budgetApi = {
  save: (month: string, amount: number) =>
    api<void>(`/budget/${month}`, {
      method: 'PUT',
      data: { amount },
    }),
};
