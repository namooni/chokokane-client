import { AxiosRequestConfig } from 'axios';
import { api } from '../apis/apiClient';
import { Expense, ExpenseContent, ExpenseRequest, Sort } from '../util/expense';

export type ExpenseFilterParams = {
  categories?: string[];
  minAmount?: number;
  maxAmount?: number;
  sort?: Sort;
  page?: number;
  size?: number;
};

export const expenseRepository = {
  getAll: (params?: ExpenseFilterParams) => {
    const options: AxiosRequestConfig = {};

    if (params) {
      options.params = {
        ...params,
        categories: params.categories?.join(','),
      };
    }

    return api<Expense>('/expenses', options);
  },
  create: async (expense: ExpenseRequest) => {
    const expenses = await api<ExpenseContent>('/expenses', {
      method: 'POST',
      data: expense,
    });

    return expenses;
  },
  update: (id: number, expense: ExpenseRequest) =>
    api<ExpenseContent>(`/expenses/${id}`, {
      method: 'PUT',
      data: expense,
    }),
  remove: (id: number) => api<void>(`/expenses/${id}`, { method: 'DELETE' }),
};
