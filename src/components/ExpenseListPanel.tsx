import styled from 'styled-components';
import { Expense, ExpenseContent, yen } from '../util/expense';
import SelectInput from './Input/SelectInput';
import { sortItems } from '../constants/expenseSortItems';
import { ChangeEvent } from 'react';
import { Pagination } from './Pagination/Pagination';

type ExpenseListPanelProps = {
  expenses: Expense;
  loading: boolean;
  error: string;
  onEdit: (expense: ExpenseContent) => void;
  onRemove: (id: number) => void;
  sort: (event: ChangeEvent<HTMLSelectElement>) => void;
  selectedSort: string;
  onPageChange: (page: number) => void;
};

export const ExpenseListPanel = ({
  expenses,
  loading,
  error,
  onEdit,
  onRemove,
  sort,
  selectedSort,
  onPageChange,
}: ExpenseListPanelProps) => {
  const content = expenses.content;

  return (
    <ListCard>
      <ListHeader>
        <SectionHeading>
          <SectionEyebrow>HISTORY</SectionEyebrow>
          <SectionTitle>最近の支出</SectionTitle>
        </SectionHeading>
        <RecordCount>{expenses.totalElements} records</RecordCount>
        <SortWrap>
          <Sort value={selectedSort} onChange={sort}>
            {sortItems.map((item) => (
              <option key={item.label} value={item.value}>
                {item.label}
              </option>
            ))}
          </Sort>
        </SortWrap>
      </ListHeader>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {loading ? (
        <EmptyState>読み込み中...</EmptyState>
      ) : content.length === 0 ? (
        <EmptyState>
          まだ支出履歴がありません。
          <br />
          最初の支出を記録しましょう。
        </EmptyState>
      ) : (
        <ExpenseList>
          {content.map((expense) => (
            <ExpenseRow key={expense.id}>
              <CategoryIcon>
                {expense.category.slice(0, 1).toUpperCase()}
              </CategoryIcon>
              <ExpenseMain>
                <ExpenseDetails>
                  <ExpenseMemo>{expense.memo || 'No memo'}</ExpenseMemo>
                  <ExpenseMeta>
                    {expense.category} · #{expense.id}
                  </ExpenseMeta>
                </ExpenseDetails>
                <ExpenseSub>
                  <ExpenseDateTime>
                    <ExpenseDate>{expense.expenseDate}</ExpenseDate>
                    <ExpenseTime>
                      {expense.expenseTime?.slice(0, 5)}
                    </ExpenseTime>
                  </ExpenseDateTime>
                  <ExpenseAmount>{yen.format(expense.amount)}</ExpenseAmount>
                </ExpenseSub>
              </ExpenseMain>
              <Actions>
                <ActionButton onClick={() => onEdit(expense)}>
                  編集
                </ActionButton>
                <ActionButton onClick={() => onRemove(expense.id)}>
                  削除
                </ActionButton>
              </Actions>
            </ExpenseRow>
          ))}
        </ExpenseList>
      )}
      <Pagination
        pageCount={expenses.totalPages}
        currentPage={expenses.page}
        onPageChange={onPageChange}
      />
    </ListCard>
  );
};

const Card = styled.section`
  background: #fbfaf6;
  border: 1px solid #dfddd4;
  border-radius: 20px;
  padding: 28px;

  @media (max-width: 500px) {
    padding: 20px;
  }
`;
const ListCard = Card;
const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  padding-bottom: 22px;
  border-bottom: 1px solid #e2e0d8;
`;
const SectionHeading = styled.div``;
const SectionEyebrow = styled.p`
  margin: 0 0 6px;
  font-size: 11px;
  letter-spacing: 0.18em;
  font-weight: 700;
  color: #69736d;
`;
const SectionTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  letter-spacing: -0.03em;
`;
const RecordCount = styled.span`
  font-size: 12px;
  color: #808780;
`;
const SortWrap = styled.div``;
const Sort = styled(SelectInput)``;
const ErrorMessage = styled.div`
  margin: 18px 0 0;
  padding: 12px 14px;
  background: #f8e8e4;
  border-radius: 10px;
  color: #8c3c30;
  font-size: 13px;
`;
const EmptyState = styled.div`
  text-align: center;
  padding: 70px 20px;
  color: #8b918d;
  line-height: 1.7;
`;
const ExpenseList = styled.div``;
const ExpenseRow = styled.article`
  display: grid;
  grid-template-columns: 46px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #e7e5de;

  @media (max-width: 800px) {
    grid-template-columns: 42px 1fr;
  }
`;
const CategoryIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #e4e9e2;
  color: #264b38;
  display: grid;
  place-items: center;
  font-weight: 700;
`;
const ExpenseMain = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 500px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 7px;
  }
`;
const ExpenseDetails = styled.div``;
const ExpenseMemo = styled.strong`
  display: block;
  font-size: 15px;
`;
const ExpenseDateTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ExpenseDate = styled.div`
  font-size: 12px;
  color: #858b86;
`;
const ExpenseTime = styled(ExpenseDate)``;
const ExpenseMeta = styled.span`
  display: block;
  font-size: 12px;
  color: #858b86;
  margin-top: 4px;
`;
const ExpenseSub = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
const ExpenseAmount = styled.b`
  font-size: 16px;
  white-space: nowrap;
`;
const Actions = styled.div`
  display: flex;
  gap: 6px;
  margin-left: 8px;

  @media (max-width: 800px) {
    grid-column: 2;
    margin: 0;
  }
`;
const ActionButton = styled.button`
  border: 1px solid #d9d7cf;
  background: transparent;
  border-radius: 8px;
  padding: 7px 9px;
  font-size: 11px;
  cursor: pointer;

  &:hover {
    background: #eeece4;
  }
`;
