import styled from 'styled-components';
import { useSettings } from '../../hooks/settings/useSettings';
import { PrimaryButton } from '../../components/ui/FormControls';
import { colors } from '../../theme/palette';
import { yen } from '../../util/expense';
import { BudgetEditSheet } from '../../components/budget/BudgetEditSheet';
import { CategoryManageSheet } from '../../components/categories/CategoryManageSheet';
import { QuickCategorySheet } from '../../components/categories/QuickCategorySheet';
import { ChangePasswordSheet } from '../../components/settings/ChangePasswordSheet';

const SettingPage = () => {
  const settings = useSettings();
  const { loggingOut, error, handleLogout } = settings;

  return (
    <Page>
      <Management aria-labelledby="management-heading">
        <Label id="management-heading">家計簿の設定</Label>
        <MenuButton
          type="button"
          onClick={settings.openBudget}
          disabled={
            loggingOut || settings.budgetLoading || !!settings.budgetError
          }
        >
          <MenuIcon aria-hidden="true">¥</MenuIcon>
          <MenuText>
            <strong>月の予算</strong>
            <span>
              {settings.monthLabel} ·{' '}
              {settings.budgetLoading
                ? '読み込み中...'
                : settings.budgetError
                  ? '取得できませんでした'
                  : settings.budget === null
                    ? '未設定'
                    : yen.format(settings.budget)}
            </span>
          </MenuText>
          <Chevron aria-hidden="true">›</Chevron>
        </MenuButton>
        {settings.budgetError && (
          <Error role="alert">
            {settings.budgetError}
            <Retry type="button" onClick={settings.retryBudget}>
              再読み込み
            </Retry>
          </Error>
        )}
        <MenuButton
          type="button"
          onClick={settings.openCategories}
          disabled={
            loggingOut || settings.categoryLoading || !!settings.categoryError
          }
        >
          <MenuIcon $category aria-hidden="true">
            ☷
          </MenuIcon>
          <MenuText>
            <strong>カテゴリー管理</strong>
            <span>
              {settings.categoryLoading ? '読み込み中...' : '追加・編集・削除'}
            </span>
          </MenuText>
          <Chevron aria-hidden="true">›</Chevron>
        </MenuButton>
        {settings.categoryError && (
          <Error role="alert">
            {settings.categoryError}
            <Retry type="button" onClick={settings.retryCategories}>
              再読み込み
            </Retry>
          </Error>
        )}
      </Management>
      <Section aria-labelledby="account-heading">
        <Heading id="account-heading">アカウント</Heading>
        <EmailDetails>
          <dt>メールアドレス</dt>
          <dd>
            {settings.userLoading ? (
              <span role="status">読み込み中...</span>
            ) : settings.userError ? (
              <>
                <ErrorText role="alert">{settings.userError}</ErrorText>
                <Retry
                  type="button"
                  onClick={settings.retryUser}
                  disabled={loggingOut}
                >
                  再読み込み
                </Retry>
              </>
            ) : (
              settings.user?.email
            )}
          </dd>
        </EmailDetails>
        <PasswordButton
          type="button"
          onClick={settings.openPassword}
          disabled={loggingOut}
        >
          パスワード変更 <Chevron aria-hidden="true">›</Chevron>
        </PasswordButton>
        <Description>この端末からログアウトします。</Description>
        <LogoutButton
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          aria-busy={loggingOut}
        >
          {loggingOut ? 'ログアウト中...' : 'ログアウト'}
        </LogoutButton>
        {error && <Error role="alert">{error}</Error>}
      </Section>
      {settings.sheet === 'password' && (
        <ChangePasswordSheet
          onClose={settings.closeSheet}
          email={settings.user?.email}
        />
      )}
      {settings.sheet === 'budget' && (
        <BudgetEditSheet
          allowMonthChange
          month={settings.month}
          budget={settings.budget}
          onClose={settings.closeSheet}
          onSaved={settings.onBudgetSaved}
        />
      )}
      {settings.sheet === 'categories' && (
        <CategoryManageSheet
          categories={settings.categories}
          onClose={settings.closeSheet}
          onDelete={settings.deleteCategory}
          onDeleted={settings.onCategoryDeleted}
          onUpdate={settings.updateCategory}
          onAdd={settings.openCategoryCreate}
        />
      )}
      {settings.sheet === 'createCategory' && (
        <QuickCategorySheet
          onClose={settings.backToCategories}
          onCreate={settings.createCategory}
          onCreated={settings.onCategoryCreated}
        />
      )}
      {settings.toast && (
        <Toast role="status" onClick={settings.dismissToast}>
          {settings.toast}
        </Toast>
      )}
    </Page>
  );
};

export default SettingPage;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 24px;
`;
const Management = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Label = styled.h2`
  margin: 0 4px;
  font-size: 13px;
  color: ${colors.textMuted};
`;
const MenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-height: 86px;
  padding: 16px;
  border: 1px solid ${colors.borderSubtle};
  border-radius: 18px;
  background: ${colors.surface};
  color: ${colors.text};
  text-align: left;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
const MenuIcon = styled.span<{ $category?: boolean }>`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 12px;
  background: ${({ $category }) => ($category ? colors.warningSoft : colors.primarySoft)};
  color: ${({ $category }) => ($category ? colors.warning : colors.primary)};
  font-size: 24px;
  font-weight: 700;
`;
const MenuText = styled.span`
  flex: 1;
  min-width: 0;
  strong {
    display: block;
    font-size: 16px;
  }
  span {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    color: ${colors.textMuted};
    overflow-wrap: anywhere;
  }
`;
const Chevron = styled.span`
  color: ${colors.textMuted};
  font-size: 22px;
`;
const Retry = styled.button`
  margin-left: 8px;
  padding: 8px;
  border: 0;
  background: transparent;
  color: ${colors.primary};
  cursor: pointer;
`;
const Toast = styled.button`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3000;
  width: calc(100% - 32px);
  max-width: 398px;
  padding: 14px;
  border: 1px solid ${colors.primaryBorder};
  border-radius: 12px;
  background: ${colors.successSoft};
  color: ${colors.success};
  cursor: pointer;
`;
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border: 1px solid ${colors.borderSubtle};
  border-radius: 18px;
  background: ${colors.surface};
`;
const Heading = styled.h2`
  margin: 0;
  font-size: 16px;
  color: ${colors.text};
`;
const PasswordButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 0 0 12px;
  border: 0;
  border-bottom: 1px solid ${colors.borderSubtle};
  background: transparent;
  color: ${colors.text};
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
const Description = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.textMuted};
`;
const EmailDetails = styled.dl`
  margin: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid ${colors.borderSubtle};
  dt {
    font-size: 13px;
    color: ${colors.textSecondary};
  }
  dd {
    margin: 8px 0 0;
    font-size: 13px;
    color: ${colors.textMuted};
    overflow-wrap: anywhere;
    line-height: 1.7;
  }
`;
const ErrorText = styled.span`
  color: ${colors.danger};
`;
const LogoutButton = styled(PrimaryButton)`
  background: ${colors.dangerSoft};
  color: ${colors.danger};
`;
const Error = styled.p`
  margin: 0;
  color: ${colors.danger};
  font-size: 13px;
  line-height: 1.6;
`;
