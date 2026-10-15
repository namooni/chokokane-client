import { useCategoryManage } from '../../hooks/category/useCategoryManage';
import styled from 'styled-components';
import type { Category, UpdateCategoryInput } from '../../constants/category';
import { BottomSheet } from '../ui/BottomSheet';
import { Text } from '../Text';
import { colors } from '../../theme/palette';
import { CategoryEditSheet } from './CategoryEditSheet';
import { TextAction } from '../ui/FormControls';

type Props = {
  onAdd?: () => void;
  categories: Category[];
  onClose: () => void;
  onDelete: (categoryId: number) => Promise<void>;
  onDeleted: (categoryId: number) => void;
  onUpdate: (
    input: UpdateCategoryInput,
    categoryId: number,
  ) => Promise<Category>;
};

export const CategoryManageSheet = ({
  categories,
  onClose,
  onDelete,
  onDeleted,
  onUpdate,
  onAdd,
}: Props) => {
  const {
    deleteTarget,
    setDeleteTarget,
    editTarget,
    setEditTarget,
    deleting,
    error,
    handleDelete,
    startEdit,
    requestDelete,
  } = useCategoryManage({ onDelete, onDeleted });

  if (editTarget) {
    return (
      <CategoryEditSheet
        category={editTarget}
        onClose={() => setEditTarget(null)}
        onUpdate={onUpdate}
        onUpdated={() => setEditTarget(null)}
      />
    );
  }

  return (
    <BottomSheet title="カテゴリー管理" onClose={onClose}>
      <Header>
        <Text variant="title">カテゴリー管理</Text>
        <Close type="button" onClick={onClose} aria-label="閉じる">
          ✕
        </Close>
      </Header>

      {onAdd && (
        <TextAction type="button" onClick={onAdd} disabled={deleting}>
          ＋ カテゴリーを追加
        </TextAction>
      )}

      {categories.map((category) => (
        <CategoryRow key={category.id}>
          <CategoryInfo>
            <ColorDot $color={category.color} />
            <Text variant="small">{category.name}</Text>
          </CategoryInfo>

          {!category.isSystem && (
            <RowActions>
              <EditButton
                type="button"
                disabled={deleting}
                onClick={() => startEdit(category)}
              >
                編集
              </EditButton>

              <DeleteButton
                type="button"
                disabled={deleting}
                onClick={() => requestDelete(category)}
              >
                削除
              </DeleteButton>
            </RowActions>
          )}
        </CategoryRow>
      ))}

      {deleteTarget && (
        <ConfirmArea>
          <Text variant="small" weight={600}>
            「{deleteTarget.name}」を削除しますか？
          </Text>
          <Text variant="caption" tone="muted">
            過去の支出記録は削除されません。
          </Text>

          <Actions>
            <CancelButton
              type="button"
              disabled={deleting}
              onClick={() => setDeleteTarget(null)}
            >
              キャンセル
            </CancelButton>
            <ConfirmDeleteButton
              type="button"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? '削除中...' : '削除する'}
            </ConfirmDeleteButton>
          </Actions>
        </ConfirmArea>
      )}

      {error && (
        <Text variant="caption" tone="danger">
          {error}
        </Text>
      )}
    </BottomSheet>
  );
};

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Close = styled.button`
  border: 0;
  background: transparent;
  color: ${colors.textSecondary};
  font-size: 1.25rem;
  cursor: pointer;
`;

const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid ${colors.primaryBorder};
`;

const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ColorDot = styled.span<{ $color: string }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const DeleteButton = styled.button`
  border: 0;
  background: transparent;
  color: #d65b5b;
  font-size: 0.875rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ConfirmArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  padding: 16px;
  border-radius: 12px;
  background: ${colors.successSoft};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const CancelButton = styled.button`
  padding: 10px 14px;
  border: 1px solid ${colors.primaryBorder};
  border-radius: 8px;
  background: transparent;
  color: ${colors.textSecondary};
  cursor: pointer;
`;

const ConfirmDeleteButton = styled.button`
  padding: 10px 14px;
  border: 0;
  border-radius: 8px;
  background: #d65b5b;
  color: white;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const EditButton = styled.button`
  border: 0;
  background: transparent;
  color: ${colors.primary};
  font-size: 0.875rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
