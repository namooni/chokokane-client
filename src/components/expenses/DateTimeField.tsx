import type { FieldErrors } from 'react-hook-form';
import styled from 'styled-components';

import { Text } from '../Text';
import {
  FormField,
  FormInput,
  FormSection,
  TextAction,
} from '../ui/FormControls';
import type { ExpenseFormValues } from '../../constants/expense';
import { getTodayJST, openNativePicker } from '../../util/date';

type Props = {
  expanded: boolean;
  date: string | null;
  time: string | null;
  errors: FieldErrors<ExpenseFormValues>;
  onExpand: () => void;
  onDateChange: (date: string | null) => void;
  onTimeChange: (time: string | null) => void;
  onClear: () => void;
};
export const DateTimeField = ({
  expanded,
  date,
  time,
  errors,
  onExpand,
  onDateChange,
  onTimeChange,
  onClear,
}: Props) => (
  <FormSection>
    <Text variant="body" weight={700}>
      日付・時間
    </Text>
    {!expanded ? (
      <TextAction type="button" onClick={onExpand}>
        ＋ 日付・時間を追加（任意）
      </TextAction>
    ) : (
      <DateFields>
        <FormField>
          <Text variant="caption" tone="secondary">
            日付
          </Text>
          <PickerInput
            type="date"
            max={getTodayJST()}
            value={date ?? ''}
            onClick={(event) => openNativePicker(event.currentTarget)}
            onChange={(event) => onDateChange(event.target.value || null)}
          />
          {errors.expenseDate && (
            <Text variant="caption" tone="danger">
              {errors.expenseDate.message}
            </Text>
          )}
        </FormField>
        <FormField>
          <Text variant="caption" tone="secondary">
            時間
          </Text>
          <PickerInput
            type="time"
            disabled={!date}
            value={time ?? ''}
            onClick={(event) => openNativePicker(event.currentTarget)}
            onChange={(event) => onTimeChange(event.target.value || null)}
          />
        </FormField>
        <TextAction type="button" onClick={onClear}>
          日付・時間を設定しない
        </TextAction>
      </DateFields>
    )}
    {errors.expenseTime && (
      <Text variant="caption" tone="danger">
        {errors.expenseTime.message}
      </Text>
    )}
  </FormSection>
);
const DateFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const PickerInput = styled(FormInput)`
  min-height: 46px;
  padding: 10px 12px;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
