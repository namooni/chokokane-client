import { useState } from 'react';
import {
  categoryColors,
  type Category,
  type CreateCategoryInput,
} from '../../constants/category';

type Props = {
  onCreate: (input: CreateCategoryInput) => Promise<Category>;
  onCreated: (category: Category) => void;
};
export const useCategorySheet = ({ onCreate, onCreated }: Props) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(categoryColors[0]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    if (saving) return;
    setError('');
    setSaving(true);
    try {
      const category = await onCreate({ name, color });
      onCreated(category);
    } catch (error) {
      setError(error instanceof Error ? error.message : '作成に失敗しました');
    } finally {
      setSaving(false);
    }
  };
  return {
    name,
    setName,
    color,
    setColor,
    error,
    saving,
    submit,
    saveDisabled: !name.trim() || saving,
  };
};
