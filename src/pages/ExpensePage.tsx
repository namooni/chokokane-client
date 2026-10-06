import styled from 'styled-components';
import { ExpenseFormPanel } from '../components/ExpenseFormPanel';
import { ExpenseListPanel } from '../components/ExpenseListPanel';
import { ExpenseOverview } from '../components/ExpenseOverview';
import { useExpenses } from '../hooks/useExpenses';
import { ExpenseLayout } from '../layouts/ExpenseLayout';

export const ExpensePage = () => {
  const expenseState = useExpenses();

  return (
    <ExpenseLayout>
      <ExpenseOverview expenses={expenseState.expenses} />
      <Workspace>
        <ExpenseFormPanel
          editingId={expenseState.editingId}
          form={expenseState.form}
          onChange={expenseState.setForm}
          onSubmit={expenseState.submit}
          onCancel={expenseState.cancelEdit}
        />
        <ExpenseListPanel
          expenses={expenseState.expenses}
          loading={expenseState.loading}
          error={expenseState.error}
          onEdit={expenseState.startEdit}
          onRemove={expenseState.remove}
          sort={expenseState.listSort}
          selectedSort={expenseState.selectedSort}
          onPageChange={expenseState.changePage}
        />
      </Workspace>
    </ExpenseLayout>
  );
};

const Workspace = styled.section`
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 28px;
  padding: 48px 0;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
