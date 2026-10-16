import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { paths } from '../../constants/pageMeta';
import { dashboardApi } from '../../apis/dashboard/dashboardApi';
import { useCategories } from '../category/useCategories';
import { getTodayJST } from '../../util/date';
import type { Category, UpdateCategoryInput } from '../../constants/category';
import { userApi, type CurrentUser } from '../../apis/user/userApi';

export const useSettings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const pending = useRef(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState('');
  const [userRevision, setUserRevision] = useState(0);
  const [month] = useState(() => getTodayJST().slice(0, 7));
  const [budget, setBudget] = useState<number | null>(null);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [budgetError, setBudgetError] = useState('');
  const [revision, setRevision] = useState(0);
  const [sheet, setSheet] = useState<
    'budget' | 'categories' | 'createCategory' | 'password' | null
  >(null);
  const [toast, setToast] = useState('');
  const category = useCategories();

  useEffect(() => {
    const controller = new AbortController();
    setUserLoading(true);
    setUserError('');
    userApi
      .getMe(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setUser(result);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setUserError('アカウント情報を読み込めませんでした。');
      })
      .finally(() => {
        if (!controller.signal.aborted) setUserLoading(false);
      });
    return () => controller.abort();
  }, [userRevision]);

  useEffect(() => {
    let active = true;
    setBudgetLoading(true);
    setBudgetError('');
    dashboardApi
      .get(month)
      .then((result) => {
        if (active) setBudget(result.budget);
      })
      .catch(() => {
        if (active) setBudgetError('予算を読み込めませんでした。');
      })
      .finally(() => {
        if (active) setBudgetLoading(false);
      });
    return () => {
      active = false;
    };
  }, [month, revision]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const updateCategory = async (input: UpdateCategoryInput, id: number) => {
    const updated = await category.updateCategory(input, id);
    setToast('カテゴリーを更新しました');
    return updated;
  };
  const onCategoryCreated = (_created: Category) => {
    setSheet('categories');
    setToast('カテゴリーを追加しました');
  };

  const handleLogout = async () => {
    if (pending.current) return;
    pending.current = true;
    setLoggingOut(true);
    setError('');
    try {
      await logout();
      navigate(paths.LOGIN, { replace: true });
    } catch {
      setError('ログアウトできませんでした。もう一度お試しください。');
    } finally {
      pending.current = false;
      setLoggingOut(false);
    }
  };

  const [year, number] = month.split('-').map(Number);
  return {
    user,
    userLoading,
    userError,
    retryUser: () => setUserRevision((value) => value + 1),
    loggingOut,
    error,
    handleLogout,
    month,
    monthLabel: `${year}年${number}月`,
    budget,
    budgetLoading,
    budgetError,
    retryBudget: () => setRevision((value) => value + 1),
    openBudget: () => {
      if (!budgetLoading && !budgetError) setSheet('budget');
    },
    onBudgetSaved: () => {
      setSheet(null);
      setBudgetLoading(true);
      setRevision((value) => value + 1);
      setToast('予算を保存しました');
    },
    sheet,
    openPassword: () => setSheet('password'),
    closeSheet: () => setSheet(null),
    openCategories: () => {
      if (!category.loading && !category.error) setSheet('categories');
    },
    openCategoryCreate: () => setSheet('createCategory'),
    backToCategories: () => setSheet('categories'),
    categories: category.categories,
    categoryLoading: category.loading,
    categoryError: category.error,
    retryCategories: category.reload,
    createCategory: category.createCategory,
    updateCategory,
    deleteCategory: category.deleteCategory,
    onCategoryCreated,
    onCategoryDeleted: () => setToast('カテゴリーを削除しました'),
    toast,
    dismissToast: () => setToast(''),
  };
};
