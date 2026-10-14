import { useEffect, useState } from 'react';
import { categoryApi } from '../../apis/categories/categoryApi';
import {
  normalizeCategoryName,
  UpdateCategoryInput,
  type Category,
  type CreateCategoryInput,
} from '../../constants/category';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    categoryApi
      .list()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch(() => {
        if (active) setError('カテゴリーを読み込めませんでした');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const createCategory = async (input: CreateCategoryInput) => {
    const name = normalizeCategoryName(input.name);
    if (!name) throw new Error('カテゴリー名を入力してください');
    if (name.length > 50) throw new Error('50文字以内で入力してください');
    if (categories.some((item) => item.name === name)) {
      throw new Error('同じ名前のカテゴリーが既にあります');
    }
    const created = await categoryApi.create({ ...input, name });
    setCategories((prev) => [...prev, created]);
    return created;
  };

  const updateCategory = async (
    input: UpdateCategoryInput,
    categoryId: number,
  ): Promise<Category> => {
    const category = categories.find((item) => item.id === categoryId);

    if (!category) {
      throw new Error('カテゴリーが見つかりません');
    }

    if (category.isSystem) {
      throw new Error('このカテゴリーは変更できません');
    }

    const name =
      input.name !== undefined
        ? normalizeCategoryName(input.name)
        : category.name;

    if (!name) {
      throw new Error('カテゴリー名を入力してください');
    }

    if (name.length > 50) {
      throw new Error('50文字以内で入力してください');
    }

    if (
      categories.some((item) => item.id !== categoryId && item.name === name)
    ) {
      throw new Error('同じ名前のカテゴリーが既にあります');
    }

    const updated = await categoryApi.update(
      {
        ...input,
        name,
      },
      categoryId,
    );

    setCategories((prev) =>
      prev.map((item) => (item.id === categoryId ? updated : item)),
    );

    return updated;
  };

  const deleteCategory = async (categoryId: number) => {
    const category = categories.find((item) => item.id === categoryId);

    if (!category) {
      throw new Error('カテゴリーが見つかりません');
    }

    if (category.isSystem) {
      throw new Error('このカテゴリーは削除できません');
    }

    await categoryApi.remove(categoryId);

    setCategories((prev) => prev.filter((item) => item.id !== categoryId));
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
