import { useState } from 'react';
import { useCategories } from '../category/useCategories';
import { useExpenseForm } from './useExpenseForm';
import type { Category } from '../../constants/category';
export const useAddExpense = () => {
  const {
    categories,
    loading,
    error: categoryError,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();
  const defaultCategoryId =
    categories.find((item) => item.name === '未分類')?.id ?? 0;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const expense = useExpenseForm(defaultCategoryId);
  const { form, submit } = expense;
  const {
    register,
    formState: { errors, isSubmitting },
    watch,
  } = form;
  const amount = watch('amount');

  const saveDisabled =
    isSubmitting ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    loading ||
    !!categoryError ||
    defaultCategoryId === 0 ||
    !categories.some((category) => category.id === expense.selectedCategoryId);
  const onCreated = (category: Category) => {
    expense.selectCategory(category.id);
    setSheetOpen(false);
  };
  const onDeleted = (categoryId: number) => {
    if (expense.selectedCategoryId === categoryId)
      expense.selectCategory(defaultCategoryId);
  };
  return {
    categories,
    loading,
    categoryError,
    createCategory,
    updateCategory,
    deleteCategory,
    sheetOpen,
    setSheetOpen,
    manageOpen,
    setManageOpen,
    expense,
    register,
    errors,
    isSubmitting,
    watch,
    submit,
    saveDisabled,
    onCreated,
    onDeleted,
  };
};
