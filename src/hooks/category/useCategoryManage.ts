import { useState } from 'react';
import {
  normalizeCategoryName,
  type Category,
  type UpdateCategoryInput,
} from '../../constants/category';
type Props = {
  onDelete: (categoryId: number) => Promise<void>;
  onDeleted: (categoryId: number) => void;
};
export const useCategoryManage = ({ onDelete, onDeleted }: Props) => {
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;

    setDeleting(true);
    setError('');

    try {
      await onDelete(deleteTarget.id);
      onDeleted(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      setError('カテゴリーを削除できませんでした');
    } finally {
      setDeleting(false);
    }
  };

  const startEdit = (category: Category) => {
    setError('');
    setDeleteTarget(null);
    setEditTarget(category);
  };
  const requestDelete = (category: Category) => {
    setError('');
    setDeleteTarget(category);
  };
  return {
    deleteTarget,
    setDeleteTarget,
    editTarget,
    setEditTarget,
    deleting,
    error,
    handleDelete,
    startEdit,
    requestDelete,
  };
};
