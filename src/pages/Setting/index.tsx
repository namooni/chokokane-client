import styled from 'styled-components';
import { useSettings } from '../../hooks/settings/useSettings';
import { PrimaryButton } from '../../components/ui/FormControls';
import { colors } from '../../theme/palette';

const SettingPage = () => {
  const { loggingOut, error, handleLogout } = useSettings();

  return (
    <Page>
      <Section aria-labelledby="account-heading">
        <Heading id="account-heading">アカウント</Heading>
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
    </Page>
  );
};

export default SettingPage;

const Page = styled.div`
  padding-top: 24px;
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
const Description = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.textMuted};
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
