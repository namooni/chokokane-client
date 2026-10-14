export type ExpenseCategory = {
  id: number;
  name: string;
  color: string;
};

export type ExpenseContent = {
  id: number;
  amount: number;
  category: ExpenseCategory;
  memo: string | null;
  expenseDate: string | null;
  expenseTime: string | null;
  createdAt: string;
};

export type Expense = {
  pagination: {
    content: ExpenseContent[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  totalAmount: number;
};

export const emptyExpensePage: Expense = {
  pagination: {
    content: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
  totalAmount: 0,
};

export type Sort = 'latest' | 'oldest' | 'highest' | 'lowest';

export type ExpenseRequest = {
  amount: number;
  categoryId: number;
  memo: string | null;
  expenseDate?: string | null;
  expenseTime?: string | null;
};

export const emptyForm: ExpenseRequest = {
  amount: 0,
  categoryId: 0,
  memo: '',
};

export const yen = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
  maximumFractionDigits: 0,
});

export type ExpenseMutationResponse = {
  id: number;
  amount: number;
  categoryId: number;
  memo: string | null;
  expenseDate: string | null;
  expenseTime: string | null;
  createdAt: string;
};
