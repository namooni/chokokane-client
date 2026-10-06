export type ExpenseContent = {
  id: number;
  amount: number;
  category: string;
  memo: string;
  expenseDate: string | null;
  expenseTime?: string | null;
};

export type Expense = {
  content: ExpenseContent[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  totalAmount: number;
};

export const emptyExpensePage: Expense = {
  content: [],
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  totalAmount: 0,
};

export type Sort = 'latest' | 'oldest' | 'highest' | 'lowest';

export type ExpenseRequest = Omit<ExpenseContent, 'id' | 'expenseDate'> & {
  expenseDate?: string | null;
  expenseTime?: string | null;
};

export const emptyForm: ExpenseRequest = {
  amount: 0,
  category: 'Food',
  memo: '',
};

export const categories = [
  'Food',
  'Transport',
  'Shopping',
  'Living',
  'Leisure',
  'Other',
];

export const yen = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
  maximumFractionDigits: 0,
});
