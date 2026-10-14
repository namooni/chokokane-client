import { expenseRepository } from '../../repositories/expenseRepository';
import type { ExpensePayload } from '../../constants/expense';

export const expenseApi = {
  async create(payload: ExpensePayload): Promise<void> {
    await expenseRepository.create(payload);
  },
};
