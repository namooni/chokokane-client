import { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { FlexBox, Text } from '../../components';
import Card from '../../components/Card';
import { colors } from '../../theme/palette';

const expenseSchema = z
  .object({
    categoryId: z.number().int().positive(),
    amount: z.number().int().positive('金額を入力してください'),
    memo: z.string().max(255, '255文字以内で入力してください'),
    expenseDate: z
      .string()
      .nullable()
      .refine(
        (date) => !date || date <= getTodayJST(),
        '未来の日付は選択できません',
      ),
    expenseTime: z.string().nullable(),
  })
  .refine((data) => !data.expenseTime || !!data.expenseDate, {
    path: ['expenseTime'],
    message: '先に日付を選択してください',
  });

type ExpenseFormValues = z.infer<typeof expenseSchema>;

type Category = {
  id: number;
  name: string;
  color: string;
};

const initialCategories: Category[] = [
  { id: 1, name: '未分類', color: colors.categoryUncategorized },
  { id: 2, name: '食費', color: colors.categoryFood },
  { id: 3, name: '交通', color: colors.categoryTransport },
  { id: 4, name: '日用品', color: colors.categoryDaily },
  { id: 5, name: '趣味', color: colors.categoryHobby },
];

const defaultValues: ExpenseFormValues = {
  categoryId: 1,
  amount: 0,
  memo: '',
  expenseDate: null,
  expenseTime: null,
};

const openPicker = (input: HTMLInputElement) => {
  if (typeof input.showPicker === 'function') {
    try {
      input.showPicker();
    } catch {
      input.focus();
    }
  } else {
    input.focus();
  }
};

const AddPage = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [isCategorySheetOpen, setCategorySheetOpen] = useState(false);
  const [showDateFields, setShowDateFields] = useState(false);
  const [toast, setToast] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues,
  });

  const selectedCategoryId = watch('categoryId');
  const expenseDate = watch('expenseDate');
  const amount = watch('amount');

  const onSubmit = async (values: ExpenseFormValues) => {
    const payload = {
      ...values,
      memo: values.memo.trim() || null,
    };

    // TODO: POST /api/v1/expenses
    console.log('Create expense:', payload);

    reset({
      ...defaultValues,
      categoryId:
        categories.find((category) => category.name === '未分類')?.id ?? 1,
    });
    setShowDateFields(false);
    setToast('支出を記録しました');
  };

  const handleCategoryCreate = (name: string, color: string) => {
    const newCategory = {
      id: Math.max(...categories.map((category) => category.id), 0) + 1,
      name,
      color,
    };

    // TODO: POST /api/v1/categories
    setCategories((prev) => [...prev, newCategory]);
    setValue('categoryId', newCategory.id, { shouldValidate: true });
    setCategorySheetOpen(false);
  };

  return (
    <AddPageWrap>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContent>
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
                aria-label="金額"
                aria-invalid={!!errors.amount}
                {...register('amount', { valueAsNumber: true })}
              />
            </AmountRow>

            {errors.amount && (
              <Text variant="caption" tone="danger">
                {errors.amount.message}
              </Text>
            )}
          </AmountCard>

          <Section>
            <SectionTitle>カテゴリー</SectionTitle>

            <CategoryGrid>
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  type="button"
                  $selected={selectedCategoryId === category.id}
                  aria-pressed={selectedCategoryId === category.id}
                  onClick={() =>
                    setValue('categoryId', category.id, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                >
                  <CategoryDot $color={category.color} />
                  <CategoryName>{category.name}</CategoryName>
                </CategoryButton>
              ))}

              <CategoryButton
                type="button"
                $selected={false}
                onClick={() => setCategorySheetOpen(true)}
              >
                <AddCircle>＋</AddCircle>
                <CategoryName>新しく追加</CategoryName>
              </CategoryButton>
            </CategoryGrid>
          </Section>

          <Section>
            <SectionTitle>メモ</SectionTitle>

            <MemoInput
              placeholder="何に使いましたか？（任意）"
              maxLength={255}
              {...register('memo')}
            />

            {errors.memo && (
              <Text variant="caption" tone="danger">
                {errors.memo.message}
              </Text>
            )}
          </Section>

          <Section>
            <SectionTitle>日付・時間</SectionTitle>

            {!showDateFields ? (
              <OptionalButton
                type="button"
                onClick={() => {
                  setValue('expenseDate', getTodayJST(), {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setShowDateFields(true);
                }}
              >
                ＋ 日付・時間を追加（任意）
              </OptionalButton>
            ) : (
              <DateFields>
                <Field>
                  <Text variant="caption" tone="secondary">
                    日付
                  </Text>
                  <DateInput
                    type="date"
                    max={getTodayJST()}
                    value={expenseDate ?? ''}
                    onClick={(event) => openPicker(event.currentTarget)}
                    onChange={(event) => {
                      const value = event.target.value || null;

                      setValue('expenseDate', value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });

                      if (!value) {
                        setValue('expenseTime', null);
                      }
                    }}
                  />
                  {errors.expenseDate && (
                    <Text variant="caption" tone="danger">
                      {errors.expenseDate.message}
                    </Text>
                  )}
                </Field>

                <Field>
                  <Text variant="caption" tone="secondary">
                    時間
                  </Text>
                  <DateInput
                    type="time"
                    disabled={!expenseDate}
                    value={watch('expenseTime') ?? ''}
                    onClick={(event) => openPicker(event.currentTarget)}
                    onChange={(event) =>
                      setValue('expenseTime', event.target.value || null, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                </Field>

                <OptionalButton
                  type="button"
                  onClick={() => {
                    setValue('expenseDate', null);
                    setValue('expenseTime', null);
                    setShowDateFields(false);
                  }}
                >
                  日付・時間を設定しない
                </OptionalButton>
              </DateFields>
            )}

            {errors.expenseTime && (
              <Text variant="caption" tone="danger">
                {errors.expenseTime.message}
              </Text>
            )}
          </Section>

          <SubmitButton type="submit" disabled={isSubmitting || !amount}>
            {isSubmitting ? '保存中...' : '支出を記録する'}
          </SubmitButton>

          {toast && (
            <Toast role="status" onClick={() => setToast('')}>
              {toast}
            </Toast>
          )}
        </FormContent>
      </form>

      {isCategorySheetOpen && (
        <QuickCategorySheet
          onClose={() => setCategorySheetOpen(false)}
          onCreate={handleCategoryCreate}
        />
      )}
    </AddPageWrap>
  );
};

const getTodayJST = () =>
  new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

const categoryColors = [
  colors.categoryFood,
  colors.categoryTransport,
  colors.categoryDaily,
  colors.categoryHobby,
  colors.categoryUncategorized,
  '#E6B95C',
  '#D87883',
  '#66B7B1',
  '#8B9BD1',
  '#B99C78',
  '#91B56C',
  '#CF89AD',
];

type QuickCategorySheetProps = {
  onClose: () => void;
  onCreate: (name: string, color: string) => void;
};

const QuickCategorySheet = ({ onClose, onCreate }: QuickCategorySheetProps) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(categoryColors[0]);

  return (
    <SheetBackdrop onClick={onClose}>
      <Sheet
        role="dialog"
        aria-modal="true"
        aria-label="カテゴリーを追加"
        onClick={(event) => event.stopPropagation()}
      >
        <SheetHeader>
          <Text variant="title">カテゴリーを追加</Text>
          <CloseButton type="button" onClick={onClose}>
            ✕
          </CloseButton>
        </SheetHeader>

        <Field>
          <Text variant="small" weight={600}>
            カテゴリー名
          </Text>
          <MemoInput
            value={name}
            maxLength={50}
            placeholder="例：医療費"
            onChange={(event) => setName(event.target.value)}
          />
        </Field>

        <Field>
          <Text variant="small" weight={600}>
            カラー
          </Text>
          <ColorGrid>
            {categoryColors.map((item) => (
              <ColorButton
                key={item}
                type="button"
                $color={item}
                $selected={color === item}
                aria-label={`カラー ${item}`}
                aria-pressed={color === item}
                onClick={() => setColor(item)}
              >
                {color === item ? '✓' : ''}
              </ColorButton>
            ))}
          </ColorGrid>
        </Field>

        <SubmitButton
          type="button"
          disabled={!name.trim()}
          onClick={() => onCreate(name.trim(), color)}
        >
          作成して選択
        </SubmitButton>
      </Sheet>
    </SheetBackdrop>
  );
};

export default AddPage;

const AddPageWrap = styled(FlexBox).attrs({
  direction: 'column',
  gap: 16,
})`
  margin-top: 16px;
`;

const FormContent = styled(FlexBox).attrs({
  direction: 'column',
  gap: 20,
})``;

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

const Section = styled(FlexBox).attrs({
  direction: 'column',
  gap: 10,
})``;

const SectionTitle = styled(Text).attrs({
  variant: 'body',
  weight: 700,
})``;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

const CategoryButton = styled.button<{ $selected: boolean }>`
  display: flex;
  min-width: 0;
  min-height: 86px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 6px;

  border: 1px solid
    ${({ $selected }) => ($selected ? colors.primary : colors.borderSubtle)};
  border-radius: 14px;

  background: ${({ $selected }) =>
    $selected ? colors.primarySoft : colors.surfaceRaised};

  cursor: pointer;
`;

const CategoryDot = styled.span<{ $color: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const CategoryName = styled.span`
  color: ${colors.text};
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
`;

const AddCircle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px dashed ${colors.primary};
  border-radius: 50%;
  color: ${colors.primary};
  font-size: 1.25rem;
`;

const MemoInput = styled.input`
  width: 100%;
  min-height: 48px;
  padding: 12px 14px;
  border: 1px solid ${colors.borderSubtle};
  border-radius: 12px;
  outline-color: ${colors.primary};
  background: ${colors.surfaceRaised};
  color: ${colors.text};
  font-size: 0.875rem;
`;

const OptionalButton = styled.button`
  align-self: flex-start;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: ${colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
`;

const DateFields = styled(FlexBox).attrs({
  direction: 'column',
  gap: 12,
})``;

const Field = styled(FlexBox).attrs({
  direction: 'column',
  gap: 6,
})``;

const DateInput = styled.input`
  width: 100%;
  min-height: 46px;
  padding: 10px 12px;
  border: 1px solid ${colors.borderSubtle};
  border-radius: 12px;
  background: ${colors.surfaceRaised};
  color: ${colors.text};

  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  min-height: 52px;
  border: 0;
  border-radius: 14px;
  background: ${colors.primary};
  color: ${colors.inverse};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Toast = styled.div`
  padding: 12px 16px;
  border-radius: 12px;
  background: ${colors.successSoft};
  color: ${colors.success};
  font-size: 0.875rem;
`;

const SheetBackdrop = styled.div`
  position: fixed;
  z-index: 2000;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: ${colors.overlay};
`;

const Sheet = styled.div`
  display: flex;
  width: 100%;
  max-width: 430px;
  flex-direction: column;
  gap: 20px;
  padding: 24px 20px calc(24px + env(safe-area-inset-bottom));
  border-radius: 24px 24px 0 0;
  background: ${colors.surfaceRaised};
`;

const SheetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled.button`
  border: 0;
  background: transparent;
  color: ${colors.textSecondary};
  font-size: 1.25rem;
  cursor: pointer;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
`;

const ColorButton = styled.button<{
  $color: string;
  $selected: boolean;
}>`
  width: 36px;
  height: 36px;
  border: ${({ $selected }) =>
    $selected ? `3px solid ${colors.primary}` : '3px solid transparent'};
  border-radius: 50%;
  background: ${({ $color }) => $color};
  color: ${colors.inverse};
  font-weight: 700;
  cursor: pointer;
`;
