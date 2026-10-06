import { SubmitEvent } from 'react';
import styled from 'styled-components';
import { categories, ExpenseRequest } from '../util/expense';
import CustomDatePicker from './Input/CustomDatePicker';
import SelectInput from './Input/SelectInput';

type ExpenseFormPanelProps = {
  editingId: number | null;
  form: ExpenseRequest;
  onChange: (form: ExpenseRequest) => void;
  onSubmit: (event: SubmitEvent) => void;
  onCancel: () => void;
};

export const ExpenseFormPanel = ({
  editingId,
  form,
  onChange,
  onSubmit,
  onCancel,
}: ExpenseFormPanelProps) => {
  const dateEnabled = Boolean(form.expenseDate);

  const toggleDate = (enabled: boolean) => {
    if (enabled) {
      const now = new Date();
      const today = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
      ].join('-');
      onChange({ ...form, expenseDate: today });
      return;
    }

    if (editingId !== null) {
      onChange({ ...form, expenseDate: null, expenseTime: null });
      return;
    }

    const nextForm = { ...form };
    delete nextForm.expenseDate;
    delete nextForm.expenseTime;
    onChange(nextForm);
  };

  return (
    <FormCard>
      <SectionHeading>
        <SectionEyebrow>
          {editingId === null ? 'NEW EXPENSE' : `EDIT #${editingId}`}
        </SectionEyebrow>
        <SectionTitle>
          {editingId === null ? '支出を追加' : '支出を編集'}
        </SectionTitle>
      </SectionHeading>
      <ExpenseForm onSubmit={onSubmit}>
        <DateOptions>
          <DateToggle>
            <DateToggleInput
              type="checkbox"
              checked={dateEnabled}
              onChange={(event) => toggleDate(event.target.checked)}
            />
            <span>日付を記録する</span>
          </DateToggle>
          {dateEnabled && (
            <DateFields>
              <Field>
                日付 <RequiredMark>必須</RequiredMark>
                <CustomDatePicker
                  value={form.expenseDate ?? undefined}
                  required
                  onChange={(expenseDate) => onChange({ ...form, expenseDate })}
                />
              </Field>
              <Field>
                時刻 <OptionalMark>任意</OptionalMark>
                <TimeInput
                  type="time"
                  value={form.expenseTime ?? ''}
                  onChange={(event) => {
                    onChange({
                      ...form,
                      expenseTime: event.target.value,
                    });
                  }}
                />
              </Field>
            </DateFields>
          )}
        </DateOptions>
        <Field>
          金額
          <AmountInput>
            <Currency>¥</Currency>
            <TextInput
              type="number"
              min="1"
              value={form.amount || ''}
              placeholder="0"
              onChange={(event) =>
                onChange({ ...form, amount: Number(event.target.value) })
              }
            />
          </AmountInput>
        </Field>
        <Field>
          カテゴリ
          <SelectInput
            value={form.category}
            onChange={(event) =>
              onChange({ ...form, category: event.target.value })
            }
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field>
          メモ
          <TextInput
            value={form.memo}
            placeholder="何に使いましたか？"
            onChange={(event) =>
              onChange({ ...form, memo: event.target.value })
            }
          />
        </Field>
        <PrimaryButton type="submit">
          {editingId === null ? '支出を記録' : '変更を保存'}
        </PrimaryButton>
        {editingId !== null && (
          <SecondaryButton type="button" onClick={onCancel}>
            キャンセル
          </SecondaryButton>
        )}
      </ExpenseForm>
    </FormCard>
  );
};

const Card = styled.aside`
  background: #fbfaf6;
  border: 1px solid #dfddd4;
  border-radius: 20px;
  padding: 28px;
  height: max-content;
  position: sticky;
  top: 20px;

  @media (max-width: 800px) {
    position: static;
  }

  @media (max-width: 500px) {
    padding: 20px;
  }
`;

const FormCard = Card;
const SectionHeading = styled.div``;
const SectionEyebrow = styled.p`
  margin: 0 0 6px;
  font-size: 11px;
  letter-spacing: 0.18em;
  font-weight: 700;
  color: #69736d;
`;
const SectionTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  letter-spacing: -0.03em;
`;
const ExpenseForm = styled.form`
  display: grid;
  gap: 18px;
  margin-top: 28px;
`;
const Field = styled.label`
  font-size: 13px;
  font-weight: 600;
  display: grid;
  gap: 8px;
`;
const InputBase = styled.input`
  width: 100%;
  border: 1px solid #d8d6cd;
  background: white;
  border-radius: 10px;
  padding: 12px 13px;
  outline: none;

  &:focus {
    border-color: #557764;
  }
`;
const TextInput = InputBase;
// const SelectInput = styled.select`
//   width: 100%;
//   border: 1px solid #d8d6cd;
//   background: white;
//   border-radius: 10px;
//   padding: 12px 13px;
//   outline: none;

//   &:focus {
//     border-color: #557764;
//   }
// `;
const DateOptions = styled.div`
  display: grid;
  gap: 14px;
`;
const DateToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  cursor: pointer;
`;
const DateToggleInput = styled.input`
  appearance: none;
  width: 38px;
  height: 22px;
  margin: 0;
  padding: 3px;
  border: 0;
  border-radius: 999px;
  background: #c7ccc7;
  cursor: pointer;
  transition: background 160ms ease;

  &::before {
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    content: '';
    transition: transform 160ms ease;
  }

  &:checked {
    background: #28533f;
  }

  &:checked::before {
    transform: translateX(16px);
  }

  &:focus-visible {
    outline: 3px solid #55776440;
    outline-offset: 2px;
  }
`;
const DateFields = styled.div`
  display: grid;
  gap: 14px;
  padding: 14px;
  border: 1px solid #e2e0d8;
  border-radius: 12px;
  background: #f7f6f0;
`;
const RequiredMark = styled.span`
  color: #8c3c30;
  font-size: 11px;
  font-weight: 600;
`;
const OptionalMark = styled.span`
  color: #788079;
  font-size: 11px;
  font-weight: 500;
`;
const TimeInput = styled(InputBase)`
  height: 44px;
`;
const AmountInput = styled.div`
  position: relative;

  ${InputBase} {
    padding-left: 30px;
  }
`;
const Currency = styled.span`
  position: absolute;
  left: 13px;
  top: 12px;
  color: #768078;
`;
const FormButton = styled.button`
  border: 0;
  border-radius: 10px;
  padding: 13px;
  cursor: pointer;
  font-weight: 700;
`;
const PrimaryButton = styled(FormButton)`
  background: #163c2c;
  color: white;
  margin-top: 5px;
`;
const SecondaryButton = styled(FormButton)`
  background: #eae7dd;
  color: #37423b;
`;
