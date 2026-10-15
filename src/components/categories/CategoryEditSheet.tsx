import { useCategoryEdit } from '../../hooks/category/useCategoryEdit';
import styled from 'styled-components';
import {
  categoryColors,
  type Category,
  type UpdateCategoryInput,
} from '../../constants/category';
import { BottomSheet } from '../ui/BottomSheet';
import { Text } from '../Text';
import { FormField, FormInput, PrimaryButton } from '../ui/FormControls';
import { colors } from '../../theme/palette';

type Props = {
  category: Category;
  onClose: () => void;
  onUpdate: (
    input: UpdateCategoryInput,
    categoryId: number,
  ) => Promise<Category>;
  onUpdated: () => void;
};

export const CategoryEditSheet = ({
  category,
  onClose,
  onUpdate,
  onUpdated,
}: Props) => {
  const {
    name,
    setName,
    color,
    setColor,
    saving,
    error,
    normalizedName,
    unchanged,
    handleSubmit,
  } = useCategoryEdit({ category, onUpdate, onUpdated });

  return (
    <BottomSheet title="カテゴリーを編集" onClose={onClose}>
      <Header>
        <Text variant="title">カテゴリーを編集</Text>
        <Close
          type="button"
          onClick={onClose}
          disabled={saving}
          aria-label="閉じる"
        >
          ✕
        </Close>
      </Header>

      <FormField>
        <Text variant="small" weight={600}>
          カテゴリー名
        </Text>
        <FormInput
          autoFocus
          value={name}
          maxLength={50}
          onChange={(event) => setName(event.target.value)}
        />
      </FormField>

      <FormField>
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
      </FormField>

      {error && (
        <Text variant="caption" tone="danger">
          {error}
        </Text>
      )}

      <PrimaryButton
        type="button"
        disabled={saving || !normalizedName || unchanged}
        onClick={handleSubmit}
      >
        {saving ? '保存中...' : '変更を保存'}
      </PrimaryButton>
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
