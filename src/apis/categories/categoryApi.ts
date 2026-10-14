import { api } from '../apiClient';
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../../constants/category';

export const categoryApi = {
  list(): Promise<Category[]> {
    return api<Category[]>('/categories');
  },

  create(input: CreateCategoryInput): Promise<Category> {
    return api<Category>('/categories', {
      method: 'POST',
      data: input,
    });
  },

  update(input: UpdateCategoryInput, categoryId: number): Promise<Category> {
    return api<Category>(`/categories/${categoryId}`, {
      method: 'PATCH',
      data: input,
    });
  },

  remove(categoryId: number): Promise<void> {
    return api<void>(`/categories/${categoryId}`, {
      method: 'DELETE',
    });
  },
};
