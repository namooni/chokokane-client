import styled from 'styled-components';
import { AmountField } from './AmountField';
import { CategoryField } from './CategoryField';
import { MemoField } from './MemoField';
import { DateTimeField } from './DateTimeField';
import { useAddExpense } from '../../hooks/expenses/useAddExpense';
import { Text } from '../Text';
import { PrimaryButton } from '../ui/FormControls';
import { QuickCategorySheet } from '../categories/QuickCategorySheet';
import { colors } from '../../theme/palette';
import { CategoryManageSheet } from '../categories/CategoryManageSheet';

export const ExpenseForm = () => {
  const {
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
  } = useAddExpense();

  return (
    <>
      <Form onSubmit={submit}>
        <AmountField register={register} errors={errors} />
        {categoryError && (
          <Text variant="caption" tone="danger">
            {categoryError}
          </Text>
        )}
        <CategoryField
          categories={categories}
          selectedId={expense.selectedCategoryId}
          onSelect={expense.selectCategory}
          onAdd={() => setSheetOpen(true)}
          onManage={setManageOpen}
        />
        {loading && (
          <Text variant="caption" tone="muted">
            カテゴリーを読み込み中...
          </Text>
        )}
        <MemoField register={register} errors={errors} />
        <DateTimeField
          expanded={expense.showDateFields}
          date={watch('expenseDate')}
          time={watch('expenseTime')}
          errors={errors}
          onExpand={expense.enableDate}
          onDateChange={expense.changeDate}
          onTimeChange={expense.changeTime}
          onClear={expense.disableDate}
        />
        <PrimaryButton type="submit" disabled={saveDisabled}>
          {isSubmitting ? '保存中...' : '支出を記録する'}
        </PrimaryButton>
        {expense.submitError && (
          <Text variant="caption" tone="danger">
            {expense.submitError}
          </Text>
        )}
        {expense.toast && (
          <Toast role="status" onClick={expense.dismissToast}>
            {expense.toast}
          </Toast>
        )}
      </Form>
      {sheetOpen && (
        <QuickCategorySheet
          onClose={() => setSheetOpen(false)}
          onCreate={createCategory}
          onCreated={onCreated}
        />
      )}
      {manageOpen && (
        <CategoryManageSheet
          categories={categories}
          onClose={() => setManageOpen(false)}
          onDelete={deleteCategory}
          onUpdate={updateCategory}
          onDeleted={onDeleted}
        />
      )}
    </>
  );
};
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Toast = styled.div`
  position: fixed;
  top: calc(20px + env(safe-area-inset-top));
  left: 50%;
  z-index: 3000;

  width: calc(100% - 32px);
  max-width: 398px;
  padding: 14px 18px;

  transform: translateX(-50%);

  border: 1px solid ${colors.primaryBorder};
  border-radius: 12px;

  background: ${colors.successSoft};
  color: ${colors.success};

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
`;
