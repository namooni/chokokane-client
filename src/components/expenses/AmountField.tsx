import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import styled from 'styled-components';
import type { ExpenseFormValues } from '../../constants/expense';
import { Text } from '../Text';
import Card from '../Card';
import { colors } from '../../theme/palette';

type Props = {
  register: UseFormRegister<ExpenseFormValues>;
  errors: FieldErrors<ExpenseFormValues>;
};
export const AmountField = ({ register, errors }: Props) => (
  <AmountCard gap={8}>
    <Text variant="caption" tone="muted">
      金額
    </Text>
    <AmountRow>
      <Currency>¥</Currency>
      <AmountInput
        type="number"
        min="1"
        inputMode="numeric"
        placeholder="0"
        onFocus={(event) => {
          if (event.currentTarget.value === '0') {
            event.currentTarget.select();
          }
        }}
        {...register('amount', { valueAsNumber: true })}
      />
    </AmountRow>
    {errors.amount && (
      <Text variant="caption" tone="danger">
        {errors.amount.message}
      </Text>
    )}
  </AmountCard>
);
const AmountCard = styled(Card)`
  border: 1px solid ${colors.borderSubtle};
`;
const AmountRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Currency = styled.span`
  color: ${colors.primary};
  font-size: 2rem;
  font-weight: 700;
`;
const AmountInput = styled.input`
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${colors.primary};
  font-size: 2rem;
  font-weight: 700;
  &::placeholder {
    color: ${colors.textSubtle};
  }
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
  }
  appearance: textfield;
`;
