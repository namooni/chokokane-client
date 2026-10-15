import type { ExpenseRequest } from '../../util/expense';
import { getTodayJST } from '../../util/date';
import { useCategories } from '../category/useCategories';

type Props = {
  editingId: number | null;
  form: ExpenseRequest;
  onChange: (form: ExpenseRequest) => void;
};

export const useExpenseFormPanel = ({ editingId, form, onChange }: Props) => {
  const { categories, loading, error } = useCategories();

  const toggleDate = (enabled: boolean) => {
    if (enabled) {
      onChange({ ...form, expenseDate: getTodayJST() });
    } else if (editingId !== null) {
      onChange({ ...form, expenseDate: null, expenseTime: null });
    } else {
      const { expenseDate, expenseTime, ...nextForm } = form;
      onChange(nextForm);
    }
  };

  const selectCategory = (value: string) => {
    onChange({ ...form, categoryId: Number(value) });
  };

  return {
    categories,
    loading,
    error,
    dateEnabled: Boolean(form.expenseDate),
    toggleDate,
    selectCategory,
  };
};
