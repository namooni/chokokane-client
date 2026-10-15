import type { ExpenseContent } from './expense';

export const appendHistoryItems = (
  previous: ExpenseContent[],
  incoming: ExpenseContent[],
) => [
  ...new Map(
    [...previous, ...incoming].map((item) => [item.id, item]),
  ).values(),
];

export const groupHistoryItems = (items: ExpenseContent[]) => {
  const groups = new Map<string, ExpenseContent[]>();
  items.forEach((item) => {
    const date = item.expenseDate ?? 'undated';
    groups.set(date, [...(groups.get(date) ?? []), item]);
  });
  return [...groups];
};

export const expenseMonth = (expense: ExpenseContent) => {
  if (expense.expenseDate) return expense.expenseDate.slice(0, 7);
  // LocalDateTime from the server represents UTC; offset timestamps retain their offset.
  const timestamp = /(?:Z|[+-]\d{2}:\d{2})$/.test(expense.createdAt)
    ? expense.createdAt
    : `${expense.createdAt}Z`;
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
  }).format(new Date(timestamp));
};

export const sortHistory = (items: ExpenseContent[]) =>
  [...items].sort(
    (a, b) =>
      Number(!a.expenseDate) - Number(!b.expenseDate) ||
      (b.expenseDate ?? '').localeCompare(a.expenseDate ?? '') ||
      Number(!a.expenseTime) - Number(!b.expenseTime) ||
      (b.expenseTime ?? '').localeCompare(a.expenseTime ?? '') ||
      b.createdAt.localeCompare(a.createdAt) ||
      b.id - a.id,
  );
