import type { Analytics } from '../apis/analytics/analyticsApi';

export const analyticsPresentation = (data: Analytics, today: string) => {
  const isCurrentMonth = data.month === today.slice(0, 7);
  const baseline =
    isCurrentMonth &&
    data.budget !== null &&
    data.dailySpendable !== null &&
    data.dailySpendable > 0
      ? data.dailySpendable
      : null;
  const scale =
    Math.max(
      1,
      baseline ?? 0,
      ...data.dailyExpenses.map((day) => day.totalAmount),
    ) * 1.15;
  const maxCategory = Math.max(
    1,
    ...data.categoryTotals.map((item) => item.amount),
  );
  return {
    baseline,
    baselinePosition: baseline === null ? 0 : (baseline / scale) * 100,
    hasDatedExpenses: data.dailyExpenses.some((day) => day.totalAmount > 0),
    defaultDate: isCurrentMonth
      ? today
      : (data.dailyExpenses.at(-1)?.date ?? ''),
    days: data.dailyExpenses.map((day) => ({
      ...day,
      dayNumber: Number(day.date.slice(8)),
      future: day.date > today,
      segments: day.categories.map((item) => ({
        ...item,
        height: (item.amount / scale) * 100,
      })),
    })),
    categories: data.categoryTotals
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount || a.category.id - b.category.id)
      .map((item) => ({
        ...item,
        percentage:
          data.monthlySpent > 0 ? (item.amount / data.monthlySpent) * 100 : 0,
        width: (item.amount / maxCategory) * 100,
      })),
    budgetProgress:
      data.budget !== null && data.budget > 0
        ? Math.min(100, Math.max(0, (data.monthlySpent / data.budget) * 100))
        : data.budget === 0 && data.monthlySpent > 0
          ? 100
          : 0,
  };
};
