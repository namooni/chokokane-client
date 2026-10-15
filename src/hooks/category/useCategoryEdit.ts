import { useState } from 'react';
import {
  normalizeCategoryName,
  type Category,
  type UpdateCategoryInput,
} from '../../constants/category';
type Props = {
  category: Category;
  onUpdate: (
    input: UpdateCategoryInput,
    categoryId: number,
  ) => Promise<Category>;
  onUpdated: () => void;
};
export const useCategoryEdit = ({ category, onUpdate, onUpdated }: Props) => {
  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const normalizedName = normalizeCategoryName(name);

  const unchanged =
    normalizedName === category.name && color === category.color;

  const handleSubmit = async () => {
    if (saving || unchanged || !normalizedName) return;

    setSaving(true);
    setError('');

    try {
      await onUpdate(
        {
          name: normalizedName,
          color,
        },
        category.id,
      );

      onUpdated();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'カテゴリーを変更できませんでした',
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    name,
    setName,
    color,
    setColor,
    saving,
    error,
    normalizedName,
    unchanged,
    handleSubmit,
  };
};
