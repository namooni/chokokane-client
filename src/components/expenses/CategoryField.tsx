import styled from 'styled-components';
import type { Category } from '../../constants/category';
import { FormSection } from '../ui/FormControls';
import { Text } from '../Text';
import { colors } from '../../theme/palette';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  categories: Category[];
  selectedId: number;
  onSelect: (id: number) => void;
  onAdd?: () => void;
  onManage?: Dispatch<SetStateAction<boolean>>;
};
export const CategoryField = ({
  categories,
  selectedId,
  onSelect,
  onAdd,
  onManage,
}: Props) => (
  <FormSection>
    <Header>
      <Text variant="body" weight={700}>
        カテゴリー
      </Text>
      {onManage && (
        <ManageButton type="button" onClick={() => onManage(true)}>
          カテゴリーを管理
        </ManageButton>
      )}
    </Header>
    <Grid>
      {categories.map((category) => (
        <Choice
          key={category.id}
          type="button"
          $selected={selectedId === category.id}
          aria-pressed={selectedId === category.id}
          onClick={() => onSelect(category.id)}
        >
          <Dot $color={category.color} />
          <Name>{category.name}</Name>
        </Choice>
      ))}
      {onAdd && (
        <Choice type="button" $selected={false} onClick={onAdd}>
          <AddCircle>＋</AddCircle>
          <Name>新しく追加</Name>
        </Choice>
      )}
    </Grid>
  </FormSection>
);
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;
const Choice = styled.button<{ $selected: boolean }>`
  display: flex;
  min-width: 0;
  min-height: 86px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 6px;
  border: 1px solid
    ${({ $selected }) => ($selected ? colors.primary : colors.borderSubtle)};
  border-radius: 14px;
  background: ${({ $selected }) => ($selected ? colors.primarySoft : colors.surfaceRaised)};
  cursor: pointer;
`;
const Dot = styled.span<{ $color: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;
const Name = styled.span`
  color: ${colors.text};
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
`;
const AddCircle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px dashed ${colors.primary};
  border-radius: 50%;
  color: ${colors.primary};
  font-size: 1.25rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ManageButton = styled.button`
  padding: 4px 0;
  border: 0;
  background: transparent;
  color: ${colors.primary};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
`;
