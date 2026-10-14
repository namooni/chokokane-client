import styled from 'styled-components';
import {
  Category,
  categoryColors,
  CreateCategoryInput,
} from '../../constants/category';
import { useCategorySheet } from '../../hooks/category/useCategorySheet';
import { Text } from '../Text';
import { BottomSheet } from '../ui/BottomSheet';
import { FormField, FormInput, PrimaryButton } from '../ui/FormControls';
import { colors } from '../../theme/palette';

type Props = {
  onClose: () => void;
  onCreate: (input: CreateCategoryInput) => Promise<Category>;
  onCreated: (category: Category) => void;
};
export const QuickCategorySheet = ({ onClose, onCreate, onCreated }: Props) => {
  const { name, setName, color, setColor, error, saving, submit } =
    useCategorySheet({ onCreate, onCreated });

  return (
    <BottomSheet title="カテゴリーを追加" onClose={onClose}>
      <Header>
        <Text variant="title">カテゴリーを追加</Text>
        <Close type="button" onClick={onClose} aria-label="閉じる">
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
          placeholder="例：医療費"
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
        disabled={!name.trim() || saving}
        onClick={submit}
      >
        {saving ? '作成中...' : '作成して選択'}
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
const ColorButton = styled.button<{ $color: string; $selected: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  border: ${({ $selected }) => ($selected ? `3px solid ${colors.primary}` : '3px solid transparent')};
  background: ${({ $color }) => $color};
  color: ${colors.inverse};
  font-weight: 700;
`;
