import type { Expense } from '../../util/expense';

export const useExpenseOverview = (expenses: Expense) => {
  const categoryTotals = expenses.pagination.content.reduce<
    Record<string, number>
  >((totals, expense) => {
    const name = expense.category.name;
    totals[name] = (totals[name] ?? 0) + expense.amount;
    return totals;
  }, {});
  return {
    totalAmount: expenses.totalAmount,
    totalElements: expenses.pagination.totalElements,
    topCategory:
      Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-',
  };
};
