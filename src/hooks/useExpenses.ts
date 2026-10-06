import {
  ChangeEvent,
  SubmitEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { expenseRepository } from '../repositories/expenseRepository';
import {
  emptyForm,
  emptyExpensePage,
  Expense,
  ExpenseContent,
  ExpenseRequest,
  Sort,
} from '../util/expense';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense>(emptyExpensePage);
  const [form, setForm] = useState<ExpenseRequest>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSort, setSelectedSort] = useState<Sort>('latest');
  const [selectedPage, setSelectedPage] = useState(0);

  const loadExpenses = useCallback(async () => {
    try {
      setError('');

      const data = await expenseRepository.getAll({
        sort: selectedSort,
        page: selectedPage,
      });
      setExpenses(data);
    } catch {
      setError(
        'Spring Bootサーバーに接続できません。localhost:8080が起動しているか確認してください。',
      );
    } finally {
      setLoading(false);
    }
  }, [selectedPage, selectedSort]);

  useEffect(() => {
    void loadExpenses();
  }, [loadExpenses]);

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (form.amount <= 0 || !form.category.trim()) return;

    try {
      if (editingId === null) {
        await expenseRepository.create(form);
        await loadExpenses();
      } else {
        const updated = await expenseRepository.update(editingId, form);
        setExpenses((previous) => ({
          ...previous,
          content: previous.content.map((expense) =>
            expense.id === editingId ? updated : expense,
          ),
        }));
      }
      cancelEdit();
    } catch {
      setError('保存に失敗しました。APIの状態を確認してください。');
    }
  };

  const startEdit = (expense: ExpenseContent) => {
    setEditingId(expense.id);
    setForm({
      amount: expense.amount,
      category: expense.category,
      memo: expense.memo,
      expenseDate: expense.expenseDate,
      expenseTime: expense.expenseTime,
    });
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id: number) => {
    if (!window.confirm('この支出を削除しますか？')) return;
    try {
      await expenseRepository.remove(id);
      await loadExpenses();
      if (editingId === id) cancelEdit();
    } catch {
      setError('削除に失敗しました。');
    }
  };

  const listSort = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextSort = event.target.value as Sort;
    setSelectedSort(nextSort);
    setSelectedPage(0);
  };

  const changePage = (page: number) => {
    setSelectedPage(page);
  };

  return {
    expenses,
    form,
    setForm,
    editingId,
    loading,
    error,
    submit,
    startEdit,
    cancelEdit,
    remove,
    listSort,
    selectedSort,
    changePage,
  };
};
