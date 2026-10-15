import styled from 'styled-components';
import {
  useBudgetForm,
  type BudgetFormProps,
} from '../../hooks/budget/useBudgetForm';
import { BottomSheet } from '../ui/BottomSheet';
import { FormInput, PrimaryButton, TextAction } from '../ui/FormControls';
import { colors } from '../../theme/palette';
import { yen } from '../../util/expense';

export const BudgetEditSheet = (props: BudgetFormProps) => {
  const form = useBudgetForm(props);
  return (
    <BottomSheet title="月の予算" onClose={form.close}>
      <Header>
        <h2>月の予算</h2>
        <Close
          type="button"
          onClick={form.close}
          disabled={form.busy}
          aria-label="閉じる"
        >
          ✕
        </Close>
      </Header>
      <Note>予算は月ごとに設定します。</Note>
      {props.allowMonthChange && (
        <MonthField>
          予算を設定する月
          <FormInput
            type="month"
            min="0001-01"
            max={form.currentMonth}
            value={form.month}
            onChange={(event) => form.changeMonth(event.target.value)}
            disabled={form.saving || form.copying}
          />
        </MonthField>
      )}
      <Summary>
        <Note>{form.monthLabel}</Note>
        <strong>
          {form.loading
            ? '読み込み中...'
            : form.loadError
              ? '取得できませんでした'
              : form.budget === null
                ? '予算はまだありません'
                : yen.format(form.budget)}
        </strong>
      </Summary>
      {form.loadError && (
        <Error role="alert">
          {form.loadError}
          <TextAction type="button" onClick={form.retry}>
            再読み込み
          </TextAction>
        </Error>
      )}
      <Form onSubmit={form.submit}>
        <label htmlFor="monthly-budget-amount">
          {form.budget === null ? '予算額' : '新しい予算'}
        </label>
        <FormInput
          id="monthly-budget-amount"
          type="text"
          inputMode="numeric"
          autoFocus
          autoComplete="off"
          placeholder="金額を入力"
          value={form.amount}
          disabled={form.busy || !!form.loadError}
          onChange={(event) => form.changeAmount(event.target.value)}
          aria-invalid={!!form.error}
          aria-describedby={form.error ? 'budget-error' : undefined}
        />
        {form.error && (
          <Error id="budget-error" role="alert">
            {form.error}
          </Error>
        )}
        <PrimaryButton type="submit" disabled={form.saveDisabled}>
          {form.saving ? '保存中...' : '予算を保存'}
        </PrimaryButton>
      </Form>
      <TextAction
        type="button"
        onClick={form.copyPrevious}
        disabled={form.busy || !!form.loadError}
      >
        {form.copying ? '読み込み中...' : '先月の予算額を入力'}
      </TextAction>
      <Hint>
        <strong>予算は自動で繰り越されません</strong>
        <Note>来月はあらためて設定してください。0円の予算も設定できます。</Note>
      </Hint>
    </BottomSheet>
  );
};
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h2 {
    margin: 0;
    font-size: 24px;
  }
`;
const MonthField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: ${colors.textSecondary};
`;
const Close = styled.button`
  padding: 8px;
  border: 0;
  background: transparent;
  color: ${colors.textSecondary};
  font-size: 20px;
  cursor: pointer;
`;
const Note = styled.p`
  margin: 0;
  color: ${colors.textMuted};
  font-size: 13px;
  line-height: 1.8;
`;
const Summary = styled.div`
  padding: 20px;
  border: 1px solid ${colors.borderSubtle};
  border-radius: 18px;
  strong {
    display: block;
    margin-top: 10px;
    font-size: 26px;
    color: ${colors.primary};
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  label {
    font-size: 13px;
    font-weight: 600;
    color: ${colors.textSecondary};
  }
  button {
    margin-top: 16px;
  }
`;
const Error = styled.p`
  margin: 0;
  color: ${colors.danger};
  font-size: 13px;
`;
const Hint = styled.div`
  padding: 16px;
  border-radius: 14px;
  background: ${colors.primarySoft};
  strong {
    display: block;
    margin-bottom: 6px;
    color: ${colors.primary};
    font-size: 13px;
  }
`;
