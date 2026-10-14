import { z } from 'zod';
import { getTodayJST } from '../util/date';

export const expenseSchema = z
  .object({
    categoryId: z.number().int().positive(),
    amount: z.number().int().positive('金額を入力してください'),
    memo: z.string().max(255, '255文字以内で入力してください'),
    expenseDate: z
      .string()
      .nullable()
      .refine(
        (date) =>
          !date ||
          (/^\d{4}-\d{2}-\d{2}$/.test(date) &&
            !Number.isNaN(Date.parse(`${date}T00:00:00Z`)) &&
            date <= getTodayJST()),
        '有効な過去または今日の日付を選択してください',
      ),
    expenseTime: z.string().nullable(),
  })
  .refine((data) => !data.expenseTime || !!data.expenseDate, {
    path: ['expenseTime'],
    message: '先に日付を選択してください',
  });

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
export type ExpensePayload = Omit<ExpenseFormValues, 'memo'> & {
  memo: string | null;
};

export const createExpenseDefaults = (
  categoryId: number,
): ExpenseFormValues => ({
  categoryId,
  amount: 0,
  memo: '',
  expenseDate: null,
  expenseTime: null,
});
