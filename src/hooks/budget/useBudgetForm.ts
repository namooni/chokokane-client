import { useEffect, useRef, useState, type FormEvent } from 'react';
import { budgetApi } from '../../apis/budget/budgetApi';
import { dashboardApi } from '../../apis/dashboard/dashboardApi';
import { getTodayJST } from '../../util/date';

export type BudgetFormProps = {
  month: string;
  budget: number | null;
  onClose: () => void;
  onSaved: () => void;
  allowMonthChange?: boolean;
};

export const useBudgetForm = ({
  month: initialMonth,
  budget: initialBudget,
  onClose,
  onSaved,
  allowMonthChange = false,
}: BudgetFormProps) => {
  const [month, setMonth] = useState(initialMonth);
  const [budget, setBudget] = useState(initialBudget);
  const [amount, setAmount] = useState(budget === null ? '' : String(budget));
  const [loading, setLoading] = useState(allowMonthChange);
  const [loadError, setLoadError] = useState('');
  const [revision, setRevision] = useState(0);
  const [saving, setSaving] = useState(false);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState('');
  const locked = useRef(false);
  const parsed = Number(amount);
  const valid =
    /^\d+$/.test(amount) &&
    Number.isSafeInteger(parsed) &&
    parsed <= 2147483647;
  const busy = saving || copying || loading;
  const currentMonth = getTodayJST().slice(0, 7);

  useEffect(() => {
    if (!allowMonthChange) return;
    let active = true;
    setLoading(true);
    setLoadError('');
    setError('');
    dashboardApi
      .get(month)
      .then((result) => {
        if (!active) return;
        setBudget(result.budget);
        setAmount(result.budget === null ? '' : String(result.budget));
      })
      .catch(() => {
        if (active) setLoadError('予算を読み込めませんでした。');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [month, revision, allowMonthChange]);

  const changeMonth = (value: string) => {
    if (
      !allowMonthChange ||
      locked.current ||
      value === month ||
      !/^\d{4}-(0[1-9]|1[0-2])$/.test(value) ||
      value < '0001-01' ||
      value > currentMonth
    )
      return;
    setLoading(true);
    setMonth(value);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (locked.current || loading || loadError) return;
    if (!valid) {
      setError('予算額は0〜2,147,483,647円の整数で入力してください。');
      return;
    }
    locked.current = true;
    setSaving(true);
    setError('');
    try {
      await budgetApi.save(month, parsed);
      onSaved();
    } catch {
      setError('予算を保存できませんでした。もう一度お試しください。');
    } finally {
      locked.current = false;
      setSaving(false);
    }
  };
  const copyPrevious = async () => {
    if (locked.current || loading || loadError) return;
    locked.current = true;
    setCopying(true);
    setError('');
    const [year, number] = month.split('-').map(Number);
    const previous = new Date(Date.UTC(year, number - 2, 1))
      .toISOString()
      .slice(0, 7);
    try {
      const result = await dashboardApi.get(previous);
      if (result.budget === null) setError('先月の予算は設定されていません。');
      else setAmount(String(result.budget));
    } catch {
      setError('先月の予算を読み込めませんでした。');
    } finally {
      locked.current = false;
      setCopying(false);
    }
  };
  const [year, number] = month.split('-').map(Number);
  return {
    month,
    budget,
    loading,
    loadError,
    currentMonth,
    changeMonth,
    retry: () => {
      setLoading(true);
      setRevision((value) => value + 1);
    },
    amount,
    changeAmount: (value: string) => {
      setAmount(value);
      setError('');
    },
    saving,
    copying,
    busy,
    error,
    submit,
    copyPrevious,
    saveDisabled: busy || !!loadError || !valid,
    close: () => {
      if (!locked.current) onClose();
    },
    monthLabel: `${year}年${number}月`,
  };
};
