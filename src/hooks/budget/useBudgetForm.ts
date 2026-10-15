import { useRef, useState, type FormEvent } from 'react';
import { budgetApi } from '../../apis/budget/budgetApi';
import { dashboardApi } from '../../apis/dashboard/dashboardApi';

export type BudgetFormProps = {
  month: string;
  budget: number | null;
  onClose: () => void;
  onSaved: () => void;
};

export const useBudgetForm = ({
  month,
  budget,
  onClose,
  onSaved,
}: BudgetFormProps) => {
  const [amount, setAmount] = useState(budget === null ? '' : String(budget));
  const [saving, setSaving] = useState(false);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState('');
  const locked = useRef(false);
  const parsed = Number(amount);
  const valid =
    /^\d+$/.test(amount) &&
    Number.isSafeInteger(parsed) &&
    parsed <= 2147483647;
  const busy = saving || copying;
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (locked.current) return;
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
    if (locked.current) return;
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
    saveDisabled: busy || !valid,
    close: () => {
      if (!locked.current) onClose();
    },
    monthLabel: `${year}年${number}月`,
  };
};
