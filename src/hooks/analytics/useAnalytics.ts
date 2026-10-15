import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  analyticsApi,
  type Analytics,
} from '../../apis/analytics/analyticsApi';
import { analyticsPresentation } from '../../util/analytics';
import { getTodayJST } from '../../util/date';
import { paths } from '../../constants/pageMeta';

export const useAnalytics = () => {
  const navigate = useNavigate();
  const [month, setMonth] = useState(() => getTodayJST().slice(0, 7));
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const today = getTodayJST();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setData(null);
    analyticsApi
      .get(month)
      .then((result) => {
        if (!active) return;
        setData(result);
        setSelectedDate(
          analyticsPresentation(result, getTodayJST()).defaultDate,
        );
      })
      .catch(() => {
        if (active)
          setError(
            '分析データを読み込めませんでした。もう一度お試しください。',
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [month, revision]);

  const [year, number] = month.split('-').map(Number);
  const moveMonth = (offset: number) => {
    const next = new Date(Date.UTC(year, number - 1 + offset, 1))
      .toISOString()
      .slice(0, 7);
    if (next > today.slice(0, 7)) return;
    setMonth(next);
  };
  const presentation = data ? analyticsPresentation(data, today) : null;
  const selectedDay = data?.dailyExpenses.find(
    (day) => day.date === selectedDate,
  );
  const selectDay = (date: string) => {
    if (date <= today && data?.dailyExpenses.some((day) => day.date === date))
      setSelectedDate(date);
  };
  const openHistory = (categoryId?: number) => {
    const query = new URLSearchParams({ month });
    if (categoryId !== undefined) query.set('categoryId', String(categoryId));
    navigate(`${paths.HISTORY}?${query}`);
  };

  return {
    data,
    presentation,
    loading,
    error,
    reload: () => setRevision((value) => value + 1),
    monthLabel: `${year}年${number}月`,
    isCurrentMonth: month === today.slice(0, 7),
    previousMonth: () => moveMonth(-1),
    nextMonth: () => moveMonth(1),
    canMoveNext: month < today.slice(0, 7),
    selectedDate,
    selectedDay,
    selectDay,
    selectedLabel: selectedDate
      ? `${Number(selectedDate.slice(5, 7))}月${Number(selectedDate.slice(8))}日`
      : '',
    openHistory,
  };
};
