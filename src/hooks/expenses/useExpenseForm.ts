import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getTodayJST } from '../../util/date';
import { expenseApi } from '../../apis/expense/expenseApi';
import {
  createExpenseDefaults,
  ExpenseFormValues,
  expenseSchema,
} from '../../constants/expense';

export const useExpenseForm = (defaultCategoryId: number) => {
  const [showDateFields, setShowDateFields] = useState(false);
  const [toast, setToast] = useState('');
  const [submitError, setSubmitError] = useState('');
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: createExpenseDefaults(defaultCategoryId),
  });

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast('');
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [toast]);
  const { setValue, reset, handleSubmit, watch } = form;

  // Category list is loaded asynchronously; only update untouched selection.
  useEffect(() => {
    if (defaultCategoryId > 0 && form.getValues('categoryId') === 0) {
      setValue('categoryId', defaultCategoryId, {
        shouldValidate: true,
      });
    }
  }, [defaultCategoryId, form, setValue]);

  const selectCategory = (categoryId: number) => {
    setValue('categoryId', categoryId, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  const enableDate = () => {
    setValue('expenseDate', getTodayJST(), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setShowDateFields(true);
  };
  const changeDate = (date: string | null) => {
    setValue('expenseDate', date, { shouldDirty: true, shouldValidate: true });
    if (!date)
      setValue('expenseTime', null, {
        shouldDirty: true,
        shouldValidate: true,
      });
  };
  const changeTime = (time: string | null) => {
    setValue('expenseTime', time, { shouldDirty: true, shouldValidate: true });
  };
  const disableDate = () => {
    setValue('expenseDate', null, { shouldDirty: true, shouldValidate: true });
    setValue('expenseTime', null, { shouldDirty: true, shouldValidate: true });
    setShowDateFields(false);
  };
  const submit = handleSubmit(async (values) => {
    setSubmitError('');
    setToast('');
    try {
      await expenseApi.create({ ...values, memo: values.memo.trim() || null });
      reset(createExpenseDefaults(defaultCategoryId));
      setShowDateFields(false);
      setToast('支出を記録しました');
    } catch {
      setSubmitError('保存に失敗しました。もう一度お試しください');
    }
  });

  return {
    form,
    submit,
    submitError,
    toast,
    dismissToast: () => setToast(''),
    showDateFields,
    enableDate,
    changeDate,
    changeTime,
    disableDate,
    selectCategory,
    selectedCategoryId: watch('categoryId'),
  };
};
