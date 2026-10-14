import styled from 'styled-components';
import { ExpenseForm } from '../../components/expenses/ExpenseForm';

const AddPage = () => (
  <Page>
    <ExpenseForm />
  </Page>
);
export default AddPage;

const Page = styled.div`
  margin-top: 16px;
`;
