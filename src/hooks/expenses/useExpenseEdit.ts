import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema, type ExpenseFormValues } from '../../constants/expense';
import type { ExpenseContent } from '../../util/expense';
import { expenseRepository } from '../../repositories/expenseRepository';
import { useCategories } from '../category/useCategories';
import { getTodayJST } from '../../util/date';
type Props = {
  expense: ExpenseContent;
  onClose: () => void;
  onSaved: (message: string) => void;
};
export const useExpenseEdit = ({ expense, onClose, onSaved }: Props) => {
  const { categories, loading, error: categoryError } = useCategories();
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: expense.amount,
      categoryId: expense.category.id,
      memo: expense.memo ?? '',
      expenseDate: expense.expenseDate,
      expenseTime: expense.expenseTime?.slice(0, 5) ?? null,
    },
  });
  const {
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;
  const busy = isSubmitting || deleting;
  const options = categories.some((item) => item.id === expense.category.id)
    ? categories
    : [...categories, { ...expense.category, isSystem: false }];
  const save = form.handleSubmit(async (values) => {
    setError('');
    try {
      await expenseRepository.update(expense.id, {
        ...values,
        memo: values.memo.trim() || null,
      });
      onSaved('支出を更新しました');
    } catch {
      setError('保存に失敗しました。もう一度お試しください。');
    }
  });
  const remove = async () => {
    setDeleting(true);
    setError('');
    try {
      await expenseRepository.remove(expense.id);
      onSaved('支出を削除しました');
    } catch {
      setError('削除に失敗しました。もう一度お試しください。');
    } finally {
      setDeleting(false);
    }
  };
  const close = () => {
    if (!busy) onClose();
  };
  const selectCategory = (id: number) =>
    setValue('categoryId', id, { shouldDirty: true, shouldValidate: true });
  const enableDate = () => setValue('expenseDate', getTodayJST());
  const changeDate = (value: string | null) => {
    setValue('expenseDate', value, { shouldValidate: true });
    if (!value) setValue('expenseTime', null);
  };
  const changeTime = (value: string | null) =>
    setValue('expenseTime', value, { shouldValidate: true });
  const clearDate = () => {
    setValue('expenseDate', null);
    setValue('expenseTime', null);
  };
  const requestDelete = () => {
    setError('');
    setConfirmDelete(true);
  };
  return {
    register,
    errors,
    busy,
    options,
    save,
    remove,
    close,
    selectCategory,
    enableDate,
    changeDate,
    changeTime,
    clearDate,
    requestDelete,
    cancelDelete: () => setConfirmDelete(false),
    confirmDelete,
    deleting,
    error,
    categoryError,
    isSubmitting,
    selectedCategoryId: watch('categoryId'),
    date: watch('expenseDate'),
    time: watch('expenseTime'),
    saveDisabled: busy || loading || !!categoryError,
  };
};
