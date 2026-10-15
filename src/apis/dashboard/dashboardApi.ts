import { api } from '../apiClient';
import type { ExpenseContent } from '../../util/expense';

// Server contract verified through the dashboard API; see docs/home-dashboard.md.
export type DashboardStatus =
  'NO_BUDGET' | 'OVER' | 'INSUFFICIENT_DATA' | 'WARNING' | 'SAFE';
export type Dashboard = {
  month: string;
  budget: number | null;
  monthlySpent: number;
  remainingBudget: number | null;
  dailySpendable: number | null;
  todaySpent: number | null;
  todayAllowance: number | null;
  status: DashboardStatus;
  recentExpenses: ExpenseContent[];
};

export const dashboardApi = {
  get: (month: string) => api<Dashboard>('/dashboard', { params: { month } }),
};
