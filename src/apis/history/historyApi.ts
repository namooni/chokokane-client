import { api } from '../apiClient';
import type { ExpenseCategory, ExpenseContent } from '../../util/expense';

export type HistoryResponse = {
  month: string;
  monthlyTotal: number;
  filteredTotal: number;
  availableCategories: ExpenseCategory[];
  content: ExpenseContent[];
  nextCursor: string | null;
  hasNext: boolean;
};
export type HistoryQuery = {
  month: string;
  categoryId?: number;
  undated?: boolean;
  cursor?: string;
  size?: number;
};
export const historyApi = {
  list: (params: HistoryQuery, signal?: AbortSignal) =>
    api<HistoryResponse>('/history', { params, signal }),
};
