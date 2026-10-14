import { useEffect, useState } from 'react';
import { expenseRepository } from '../../repositories/expenseRepository';
import type { ExpenseContent } from '../../util/expense';

// Compatibility adapter until the server exposes month filters and cursors.
export const useHistory = () => {
  const [items, setItems] = useState<ExpenseContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const first = await expenseRepository.getAll({
          page: 0,
          size: 100,
          sort: 'latest',
        });
        const result = [...first.pagination.content];
        for (let page = 1; page < first.pagination.totalPages; page++) {
          if (!active) return;
          const next = await expenseRepository.getAll({
            page,
            size: 100,
            sort: 'latest',
          });
          result.push(...next.pagination.content);
        }
        if (active)
          setItems([
            ...new Map(result.map((item) => [item.id, item])).values(),
          ]);
      } catch {
        if (active)
          setError('支出履歴を読み込めませんでした。もう一度お試しください。');
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [revision]);
  return {
    items,
    loading,
    error,
    reload: () => setRevision((value) => value + 1),
  };
};
