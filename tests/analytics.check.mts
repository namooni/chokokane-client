import assert from 'node:assert/strict';
import { analyticsPresentation } from '../src/util/analytics.ts';

const transport = { id: 11, name: '交通', color: '#65A7D8' };
const food = { id: 12, name: '食費', color: '#E89A64' };
const data = {
  month: '2026-10',
  budget: 12000,
  monthlySpent: 1500,
  remainingBudget: 10500,
  dailySpendable: 617,
  undatedSpent: 1500,
  dailyExpenses: Array.from({ length: 31 }, (_, index) => ({
    date: `2026-10-${String(index + 1).padStart(2, '0')}`,
    totalAmount: 0,
    categories: [] as { category: typeof transport; amount: number }[],
  })),
  categoryTotals: [{ category: transport, amount: 1500 }],
};
const undated = analyticsPresentation(data, '2026-10-15');
assert.equal(undated.hasDatedExpenses, false);
assert.equal(undated.categories[0].percentage, 100);
assert.equal(undated.categories[0].width, 100);
assert.equal(undated.days.length, 31);
assert.equal(undated.defaultDate, '2026-10-15');
assert.equal(undated.days[15].future, true);
assert.equal(undated.baseline, 617);

const mixed = analyticsPresentation(
  {
    ...data,
    monthlySpent: 2000,
    undatedSpent: 500,
    dailyExpenses: [
      {
        date: '2026-10-15',
        totalAmount: 1500,
        categories: [
          { category: food, amount: 1000 },
          { category: transport, amount: 500 },
        ],
      },
    ],
    categoryTotals: [
      { category: transport, amount: 500 },
      { category: food, amount: 1500 },
    ],
  },
  '2026-10-15',
);
assert.equal(mixed.hasDatedExpenses, true);
assert.equal(mixed.categories[0].category.id, food.id);
assert.equal(mixed.categories[0].percentage, 75);
assert.equal(mixed.categories[1].percentage, 25);
assert.equal(mixed.categories[1].width, (500 / 1500) * 100);
assert.equal(
  mixed.days[0].segments[0].height / mixed.days[0].segments[1].height,
  2,
);

const past = analyticsPresentation(data, '2026-11-01');
assert.equal(past.baseline, null);
assert.equal(past.defaultDate, '2026-10-31');
assert.equal(
  analyticsPresentation({ ...data, budget: null }, '2026-10-15').baseline,
  null,
);
assert.equal(
  analyticsPresentation({ ...data, dailySpendable: 0 }, '2026-10-15').baseline,
  null,
);
assert.equal(
  analyticsPresentation({ ...data, budget: 0 }, '2026-10-15').budgetProgress,
  100,
);
const empty = analyticsPresentation(
  { ...data, monthlySpent: 0, undatedSpent: 0, categoryTotals: [] },
  '2026-10-15',
);
assert.equal(empty.categories.length, 0);
assert.equal(empty.budgetProgress, 0);
assert.ok(empty.days.every((day) => day.segments.length === 0));
console.log(
  'Analytics: undated totals, category proportions, stacks, baseline visibility, default dates and empty states passed',
);
