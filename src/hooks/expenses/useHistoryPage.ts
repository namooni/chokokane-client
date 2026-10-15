import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHistory } from './useHistory';
import { getTodayJST } from '../../util/date';
import type { ExpenseContent } from '../../util/expense';
import { groupHistoryItems } from '../../util/history';

export const useHistoryPage = () => {
  const [searchParams] = useSearchParams();
  const [month, setMonth] = useState(() => {
    const requested = searchParams.get('month') ?? '';
    return /^\d{4}-(0[1-9]|1[0-2])$/.test(requested) &&
      requested >= '0001-01' &&
      requested <= getTodayJST().slice(0, 7)
      ? requested
      : getTodayJST().slice(0, 7);
  });
  const [filter, setFilter] = useState(() => {
    const requested = searchParams.get('categoryId') ?? '';
    return /^[1-9]\d*$/.test(requested) ? requested : 'all';
  });
  const history = useHistory(month, filter);
  const {
    data,
    items,
    loading,
    error,
    reload,
    loadingMore,
    moreError,
    loadMore,
  } = history;
  const [editing, setEditing] = useState<ExpenseContent | null>(null);
  const [toast, setToast] = useState('');
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);
  const categories = data?.availableCategories ?? [];
  const hasMore = data?.hasNext ?? false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (
      !loading &&
      !error &&
      data &&
      filter !== 'all' &&
      filter !== 'undated' &&
      !data.availableCategories.some((item) => String(item.id) === filter)
    )
      setFilter('all');
  }, [data, loading, error, filter]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!sentinel || !hasMore || loading || loadingMore || moreError || editing)
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore();
      },
      { rootMargin: '0px 0px 200px 0px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinel, hasMore, loading, loadingMore, moreError, editing, loadMore]);

  const move = (offset: number) => {
    const [year, number] = month.split('-').map(Number);
    const next = new Date(Date.UTC(year, number - 1 + offset, 1))
      .toISOString()
      .slice(0, 7);
    if (next > getTodayJST().slice(0, 7)) return;
    setMonth(next);
  };
  const groups = groupHistoryItems(items);
  const [year, number] = month.split('-').map(Number);
  return {
    loading,
    error,
    reload,
    year,
    number,
    move,
    effective: filter,
    filterOptions: [
      { id: 'all', name: 'すべて' },
      ...categories.map((item) => ({ id: String(item.id), name: item.name })),
      { id: 'undated', name: '日付未設定' },
    ],
    selectFilter: (id: string) => setFilter(id),
    monthlyTotal: data?.monthlyTotal ?? 0,
    filteredTotal: data?.filteredTotal ?? 0,
    hasMonthly: categories.length > 0,
    filteredCount: items.length,
    groups,
    hasMore,
    loadingMore,
    moreError,
    retryMore: loadMore,
    sentinelRef: setSentinel,
    editing,
    startEdit: setEditing,
    closeEdit: () => setEditing(null),
    onSaved: (message: string) => {
      setEditing(null);
      setToast(message);
      reload();
      window.scrollTo(0, 0);
    },
    toast,
    dismissToast: () => setToast(''),
    isCurrentMonth: month === getTodayJST().slice(0, 7),
    canMoveNext: month < getTodayJST().slice(0, 7),
  };
};
