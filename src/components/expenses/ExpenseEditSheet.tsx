import { useExpenseEdit } from '../../hooks/expenses/useExpenseEdit';
import styled from 'styled-components';
import type { ExpenseContent } from '../../util/expense';
import { BottomSheet } from '../ui/BottomSheet';
import { PrimaryButton, TextAction } from '../ui/FormControls';
import { AmountField } from './AmountField';
import { CategoryField } from './CategoryField';
import { MemoField } from './MemoField';
import { DateTimeField } from './DateTimeField';
import { colors } from '../../theme/palette';

type Props = {
  expense: ExpenseContent;
  onClose: () => void;
  onSaved: (message: string) => void;
};
export const ExpenseEditSheet = ({ expense, onClose, onSaved }: Props) => {
  const {
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
    cancelDelete,
    confirmDelete,
    deleting,
    error,
    categoryError,
    isSubmitting,
    selectedCategoryId,
    date,
    time,
    saveDisabled,
  } = useExpenseEdit({ expense, onClose, onSaved });

  return (
    <BottomSheet title="支出を編集" onClose={close}>
      {confirmDelete ? (
        <>
          <h2>この支出を削除しますか？</h2>
          <p>削除した支出は元に戻せません。</p>
          <Danger type="button" disabled={busy} onClick={() => void remove()}>
            {deleting ? '削除中...' : '削除する'}
          </Danger>
          <PrimaryButton disabled={busy} onClick={cancelDelete}>
            キャンセル
          </PrimaryButton>
        </>
      ) : (
        <>
          <TextAction onClick={close} disabled={busy}>
            ‹ 履歴に戻る
          </TextAction>
          <h2>支出を編集</h2>
          <Form onSubmit={save}>
            <fieldset disabled={busy}>
              <AmountField register={register} errors={errors} />
              <CategoryField
                categories={options}
                selectedId={selectedCategoryId}
                onSelect={selectCategory}
              />
              {categoryError && <Message role="alert">{categoryError}</Message>}
              <MemoField register={register} errors={errors} />
              <DateTimeField
                expanded={!!date}
                date={date}
                time={time}
                errors={errors}
                onExpand={enableDate}
                onDateChange={changeDate}
                onTimeChange={changeTime}
                onClear={clearDate}
              />
              <PrimaryButton type="submit" disabled={saveDisabled}>
                {isSubmitting ? '保存中...' : '変更を保存'}
              </PrimaryButton>
              <Danger type="button" onClick={requestDelete}>
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
