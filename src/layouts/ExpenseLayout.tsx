import { ReactNode } from 'react';
import styled from 'styled-components';
import { useAuth } from '../auth/AuthContext';

type ExpenseLayoutProps = { children: ReactNode };

export const ExpenseLayout = ({ children }: ExpenseLayoutProps) => {
  const { logout } = useAuth();

  return (
    <PageShell>
      <Topbar>
        <Brand>
          <BrandMark>¥</BrandMark>
          <span>ちょこかね</span>
        </Brand>
        <TopbarActions>
          <DateLabel>MY EXPENSE BOOK</DateLabel>
          <LogoutButton type="button" onClick={logout}>
            ログアウト
          </LogoutButton>
        </TopbarActions>
      </Topbar>
      {children}
      <Footer>ちょこかね · React + Spring Boot + MyBatis</Footer>
    </PageShell>
  );
};

const PageShell = styled.main`
  max-width: 1180px;
  margin: auto;
  padding: 0 28px;

  @media (max-width: 500px) {
    padding: 0 16px;
  }
`;

const Topbar = styled.header`
  height: 86px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d8d5ca;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 19px;
`;

const BrandMark = styled.span`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #163c2c;
  color: #f8f4e8;
`;

const DateLabel = styled.div`
  font-size: 11px;
  letter-spacing: 0.18em;
  font-weight: 700;
  color: #69736d;

  @media (max-width: 800px) {
    display: none;
  }
`;

const TopbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const LogoutButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #d8d5ca;
  border-radius: 8px;
  background: transparent;
  color: #52675a;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #e9eee8;
  }
`;

const Footer = styled.footer`
  border-top: 1px solid #d8d5ca;
  padding: 28px 0 40px;
  color: #8a908b;
  font-size: 12px;
`;
