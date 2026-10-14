import { api } from '../apis/apiClient';
import type {
  Expense,
  ExpenseRequest,
  Sort,
  ExpenseMutationResponse,
} from '../util/expense';

export type ExpenseFilterParams = {
  categoryIds?: number[];
  minAmount?: number;
  maxAmount?: number;
  sort?: Sort;
  page?: number;
  size?: number;
};

export const expenseRepository = {
  getAll: (params?: ExpenseFilterParams) =>
    api<Expense>('/expenses', {
      params: {
        ...params,
        categoryIds: params?.categoryIds?.join(','),
      },
    }),

  create: (expense: ExpenseRequest) =>
    api<ExpenseMutationResponse>('/expenses', {
      method: 'POST',
      data: expense,
    }),

  update: (id: number, expense: ExpenseRequest) =>
    api<ExpenseMutationResponse>(`/expenses/${id}`, {
      method: 'PUT',
      data: expense,
    }),

  remove: (id: number) =>
    api<void>(`/expenses/${id}`, {
      method: 'DELETE',
    }),
};
