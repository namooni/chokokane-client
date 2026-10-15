import assert from 'node:assert/strict';
import { appendHistoryItems, groupHistoryItems } from '../src/util/history.ts';

const row = (id: number, expenseDate: string | null) => ({
  id,
  amount: 1000,
  category: { id: 11, name: '交通', color: '#65A7D8' },
  memo: null,
  expenseDate,
  expenseTime: null,
  createdAt: '2026-10-15T01:00:00',
});
const first = [row(4, '2026-10-13'), row(3, '2026-10-11')];
const next = [row(2, '2026-10-11'), row(1, null)];
const merged = appendHistoryItems(first, next);
assert.deepEqual(
  merged.map((item) => item.id),
  [4, 3, 2, 1],
);
assert.deepEqual(
  first.map((item) => item.id),
  [4, 3],
);
const grouped = groupHistoryItems(merged);
assert.deepEqual(
  grouped.map(([date]) => date),
  ['2026-10-13', '2026-10-11', 'undated'],
);
assert.deepEqual(
  grouped[1][1].map((item) => item.id),
  [3, 2],
);

const retried = appendHistoryItems(merged, next);
assert.equal(retried.length, 4);
assert.deepEqual(
  retried.map((item) => item.id),
  [4, 3, 2, 1],
);
const withAnotherUndated = appendHistoryItems(merged, [row(5, null)]);
assert.deepEqual(
  groupHistoryItems(withAnotherUndated)
    .at(-1)?.[1]
    .map((item) => item.id),
  [1, 5],
);
assert.deepEqual(appendHistoryItems([], []), []);
assert.deepEqual(groupHistoryItems([]), []);
console.log(
  'History pages: server order, page boundary date grouping, duplicate IDs, undated grouping and empty pages passed',
);
