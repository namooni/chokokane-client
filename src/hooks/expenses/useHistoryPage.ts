import { useEffect, useState } from 'react';
import { useHistory } from './useHistory';
import { expenseMonth, sortHistory } from '../../util/history';
import { getTodayJST } from '../../util/date';
import type { ExpenseContent } from '../../util/expense';
export const useHistoryPage = () => {
  const { items, loading, error, reload } = useHistory();
  const [month, setMonth] = useState(() => getTodayJST().slice(0, 7));
  const [filter, setFilter] = useState('all');
  const [limit, setLimit] = useState(20);
  const [editing, setEditing] = useState<ExpenseContent | null>(null);
  const [toast, setToast] = useState('');
  const monthly = sortHistory(
    items.filter((item) => expenseMonth(item) === month),
  );
  const categories = [
    ...new Map(
      monthly.map((item) => [item.category.id, item.category]),
    ).values(),
  ];
  const effective =
    filter === 'all' ||
    filter === 'undated' ||
    categories.some((item) => String(item.id) === filter)
      ? filter
      : 'all';
  const filtered = monthly.filter(
    (item) =>
      effective === 'all' ||
      (effective === 'undated'
        ? !item.expenseDate
        : String(item.category.id) === effective),
  );
  const groups = new Map<string, ExpenseContent[]>();
  filtered.slice(0, limit).forEach((item) => {
    const key = item.expenseDate ?? 'undated';
    groups.set(key, [...(groups.get(key) ?? []), item]);
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (!loading) setFilter(effective);
  }, [effective, loading]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const move = (offset: number) => {
    const [year, number] = month.split('-').map(Number);
    setMonth(
      new Date(Date.UTC(year, number - 1 + offset, 1))
        .toISOString()
        .slice(0, 7),
    );
    setLimit(20);
  };
  const [year, number] = month.split('-').map(Number);
  const monthlyTotal = monthly.reduce((sum, item) => sum + item.amount, 0);
  const filteredTotal = filtered.reduce((sum, item) => sum + item.amount, 0);
  const filterOptions = [
    { id: 'all', name: 'すべて' },
    ...categories.map((item) => ({ id: String(item.id), name: item.name })),
    { id: 'undated', name: '日付未設定' },
  ];
  const selectFilter = (id: string) => {
    setFilter(id);
    setLimit(20);
  };
  const onSaved = (message: string) => {
    setEditing(null);
    setToast(message);
    setLimit(20);
    reload();
  };
  return {
    loading,
    error,
    reload,
    year,
    number,
    move,
    effective,
    filterOptions,
    selectFilter,
    monthlyTotal,
    filteredTotal,
    hasMonthly: monthly.length > 0,
    filteredCount: filtered.length,
    groups: [...groups],
    hasMore: filtered.length > limit,
    showMore: () => setLimit((value) => value + 20),
    editing,
    startEdit: setEditing,
    closeEdit: () => setEditing(null),
    onSaved,
    toast,
    dismissToast: () => setToast(''),
    isCurrentMonth: month === getTodayJST().slice(0, 7),
    canMoveNext: month < getTodayJST().slice(0, 7),
  };
};
