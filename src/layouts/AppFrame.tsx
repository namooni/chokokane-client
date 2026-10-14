import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../theme/palette';

const AppFrame = () => {
  return (
    <PageBackground>
      <AppContainer>
        <Outlet />
      </AppContainer>
    </PageBackground>
  );
};

export default AppFrame;

const PageBackground = styled.div`
  min-height: 100dvh;
  background: ${colors.page};
`;

const AppContainer = styled.div`
  width: 100%;
  max-width: 430px;
  min-height: 100dvh;
  margin: 0 auto;
  background: ${colors.page};
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.04);
  padding: 16px;
`;
