import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import {
  dashboardApi,
  type Dashboard,
  type DashboardStatus,
} from '../../apis/dashboard/dashboardApi';
import { getTodayJST } from '../../util/date';
import { yen } from '../../util/expense';

const statusMessages: Record<
  DashboardStatus,
  { title: string; description: string }
> = {
  NO_BUDGET: {
    title: '予算を決めて、使いすぎを防ごう',
    description: '予算を設定すると、残り金額と1日あたりの目安が表示されます。',
  },
  OVER: {
    title: '今月の予算を超えています',
    description: 'これからの支出を確認して、ペースを見直しましょう。',
  },
  INSUFFICIENT_DATA: {
    title: '少しずつ記録していきましょう',
    description:
      '月初はまだデータが少ないため、数日分の記録からペースを確認します。',
  },
  WARNING: {
    title: '少しペースを見直しましょう',
    description: '今のペースでは、月末に予算を超える可能性があります。',
  },
  SAFE: {
    title: 'いいペースです！',
    description: '今のペースなら予算内に収まりそうです。',
  },
};

export const useHomeDashboard = () => {
  const [month, setMonth] = useState(() => getTodayJST().slice(0, 7));
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setData(null);
    dashboardApi
      .get(month)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(
          isAxiosError(reason) && reason.response?.status === 404
            ? 'ホームの情報はまだ取得できません。時間をおいて、もう一度お試しください。'
            : 'ホームを読み込めませんでした。もう一度お試しください。',
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [month, revision]);

  const currentMonth = getTodayJST().slice(0, 7);
  const isCurrentMonth = month === currentMonth;
  const [year, monthNumber] = month.split('-').map(Number);
  const moveMonth = (offset: number) => {
    const next = new Date(Date.UTC(year, monthNumber - 1 + offset, 1))
      .toISOString()
      .slice(0, 7);
    if (next > currentMonth) return;
    setMonth(next);
  };
  const noBudget = data?.budget === null;
  const overBudget = data?.status === 'OVER';
  // Presentation only: all financial calculations and status decisions come from the server.
  const progress =
    data?.budget != null && data.budget > 0
      ? Math.min(Math.max((data.monthlySpent / data.budget) * 100, 0), 100)
      : data?.budget === 0 && data.monthlySpent > 0
        ? 100
        : 0;
  let comparison = '今日の日付で記録した支出';
  let todayTone: 'neutral' | 'success' | 'danger' = 'neutral';
  if (data?.todaySpent != null && data.todayAllowance != null) {
    const difference = data.todaySpent - data.todayAllowance;
    comparison =
      difference > 0
        ? `目安より ${yen.format(difference)} 多い`
        : difference < 0
          ? `目安より ${yen.format(-difference)} 少ない`
          : '今日の目安と同じです';
    todayTone = difference > 0 ? 'danger' : 'success';
  }
  const message = data ? statusMessages[data.status] : null;
  const pace =
    message && !isCurrentMonth && data?.status !== 'NO_BUDGET'
      ? {
          title: overBudget
            ? 'この月は予算を超えました'
            : 'この月は予算内に収まりました',
          description: 'この月の支出と予算を振り返ってみましょう。',
        }
      : message;
  const recentExpenses = (data?.recentExpenses ?? [])
    .slice(0, 5)
    .map((item) => ({
      ...item,
      title: item.memo || item.category.name,
      dateLabel: item.expenseDate
        ? `${Number(item.expenseDate.slice(5, 7))}/${Number(item.expenseDate.slice(8, 10))}`
        : '日付未設定',
    }));

  return {
    month,
    budgetOpen,
    openBudget: () => setBudgetOpen(true),
    closeBudget: () => setBudgetOpen(false),
    onBudgetSaved: () => {
      setBudgetOpen(false);
      setToast('予算を保存しました');
      setRevision((value) => value + 1);
    },
    toast,
    dismissToast: () => setToast(''),
    data,
    loading,
    error,
    reload: () => setRevision((value) => value + 1),
    monthLabel: `${year}年${monthNumber}月`,
    isCurrentMonth,
    previousMonth: () => moveMonth(-1),
    nextMonth: () => moveMonth(1),
    canMoveNext: month < currentMonth,
    noBudget,
    overBudget,
    progress,
    comparison,
    todayTone,
    pace,
    recentExpenses,
  };
};
