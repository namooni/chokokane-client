import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { ExpenseFormValues } from '../../constants/expense';
import { FormInput, FormSection } from '../ui/FormControls';
import { Text } from '../Text';

type Props = {
  register: UseFormRegister<ExpenseFormValues>;
  errors: FieldErrors<ExpenseFormValues>;
};
export const MemoField = ({ register, errors }: Props) => (
  <FormSection>
    <Text variant="body" weight={700}>
      メモ
    </Text>
    <FormInput
      placeholder="何に使いましたか？（任意）"
      maxLength={255}
      {...register('memo')}
    />
    {errors.memo && (
      <Text variant="caption" tone="danger">
        {errors.memo.message}
      </Text>
    )}
  </FormSection>
);
