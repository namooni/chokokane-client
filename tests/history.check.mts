import assert from 'node:assert/strict';
import { expenseMonth, sortHistory } from '../src/util/history.ts';
const base = {
  amount: 100,
  category: { id: 1, name: '食費', color: '#ffffff' },
  memo: null,
  expenseDate: null,
  expenseTime: null,
  createdAt: '2026-09-30T15:00:00',
};
assert.equal(expenseMonth({ ...base, id: 1 }), '2026-10');
assert.equal(
  expenseMonth({ ...base, id: 1, createdAt: '2026-09-30T14:59:59Z' }),
  '2026-09',
);
assert.equal(
  expenseMonth({ ...base, id: 1, expenseDate: '2026-09-01' }),
  '2026-09',
);
const rows = [
  { ...base, id: 1 },
  { ...base, id: 2, expenseDate: '2026-10-02' },
  { ...base, id: 3, expenseDate: '2026-10-02', expenseTime: '12:00' },
  { ...base, id: 4, expenseDate: '2026-10-02', expenseTime: '12:00' },
];
assert.deepEqual(
  sortHistory(rows).map((item) => item.id),
  [4, 3, 2, 1],
);
assert.deepEqual(
  rows.map((item) => item.id),
  [1, 2, 3, 4],
);
console.log(
  'History JST month boundaries, date precedence and ordering passed',
);
