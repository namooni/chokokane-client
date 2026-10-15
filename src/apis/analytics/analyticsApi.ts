import { api } from '../apiClient';
import type { ExpenseCategory } from '../../util/expense';

export type CategoryAmount = { category: ExpenseCategory; amount: number };
export type DailyExpense = {
  date: string;
  totalAmount: number;
  categories: CategoryAmount[];
};
export type Analytics = {
  month: string;
  budget: number | null;
  monthlySpent: number;
  remainingBudget: number | null;
  dailySpendable: number | null;
  undatedSpent: number;
  dailyExpenses: DailyExpense[];
  categoryTotals: CategoryAmount[];
};

export const analyticsApi = {
  get: (month: string) => api<Analytics>('/analytics', { params: { month } }),
};
