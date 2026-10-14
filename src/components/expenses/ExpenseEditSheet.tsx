import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from 'styled-components';
import { expenseSchema, type ExpenseFormValues } from '../../constants/expense';
import type { ExpenseContent } from '../../util/expense';
import { expenseRepository } from '../../repositories/expenseRepository';
import { useCategories } from '../../hooks/category/useCategories';
import { BottomSheet } from '../ui/BottomSheet';
import { PrimaryButton, TextAction } from '../ui/FormControls';
import { AmountField } from './AmountField';
import { CategoryField } from './CategoryField';
import { MemoField } from './MemoField';
import { DateTimeField } from './DateTimeField';
import { getTodayJST } from '../../util/date';
import { colors } from '../../theme/palette';

type Props = {
  expense: ExpenseContent;
  onClose: () => void;
  onSaved: (message: string) => void;
};
export const ExpenseEditSheet = ({ expense, onClose, onSaved }: Props) => {
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
  return (
    <BottomSheet
      title="支出を編集"
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      {confirmDelete ? (
        <>
          <h2>この支出を削除しますか？</h2>
          <p>削除した支出は元に戻せません。</p>
          <Danger type="button" disabled={busy} onClick={() => void remove()}>
            {deleting ? '削除中...' : '削除する'}
          </Danger>
          <PrimaryButton
            disabled={busy}
            onClick={() => setConfirmDelete(false)}
          >
            キャンセル
          </PrimaryButton>
        </>
      ) : (
        <>
          <TextAction onClick={onClose} disabled={busy}>
            ‹ 履歴に戻る
          </TextAction>
          <h2>支出を編集</h2>
          <Form onSubmit={save}>
            <fieldset disabled={busy}>
              <AmountField register={register} errors={errors} />
              <CategoryField
                categories={options}
                selectedId={watch('categoryId')}
                onSelect={(id) =>
                  setValue('categoryId', id, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
              {categoryError && <Message role="alert">{categoryError}</Message>}
              <MemoField register={register} errors={errors} />
              <DateTimeField
                expanded={!!watch('expenseDate')}
                date={watch('expenseDate')}
                time={watch('expenseTime')}
                errors={errors}
                onExpand={() => setValue('expenseDate', getTodayJST())}
                onDateChange={(value) => {
                  setValue('expenseDate', value, { shouldValidate: true });
                  if (!value) setValue('expenseTime', null);
                }}
                onTimeChange={(value) =>
                  setValue('expenseTime', value, { shouldValidate: true })
                }
                onClear={() => {
                  setValue('expenseDate', null);
                  setValue('expenseTime', null);
                }}
              />
              <PrimaryButton
                type="submit"
                disabled={busy || loading || !!categoryError}
              >
                {isSubmitting ? '保存中...' : '変更を保存'}
              </PrimaryButton>
              <Danger
                type="button"
                onClick={() => {
                  setError('');
                  setConfirmDelete(true);
                }}
              >
                この支出を削除
              </Danger>
            </fieldset>
          </Form>
        </>
      )}
      {error && <Message role="alert">{error}</Message>}
    </BottomSheet>
  );
};
const Form = styled.form`
  fieldset {
    display: flex;
    flex-direction: column;
    gap: 20px;
    border: 0;
    padding: 0;
    margin: 0;
    min-width: 0;
  }
`;
const Danger = styled(PrimaryButton)`
  background: ${colors.dangerSoft};
  color: ${colors.danger};
`;
const Message = styled.p`
  color: ${colors.danger};
  font-size: 0.875rem;
`;
