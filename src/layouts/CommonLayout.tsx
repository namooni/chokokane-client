import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import BottomNav from '../components/Layouts/BottomNav';
import { colors } from '../theme/palette';
import { pageHeaderMeta } from '../constants/pageMeta';
import { Text } from '../components';

const CommonLayout = () => {
  const { pathname } = useLocation();
  const { title, subtitle } = pageHeaderMeta[pathname];
  return (
    <>
      <Header>
        <Brand tone="accent" weight={700} variant="caption">
          CHOKOKANE
        </Brand>
        <PageTitle weight={700} variant="title">
          {title}
        </PageTitle>
        <Subtitle tone="muted" weight={400} variant="small">
          {subtitle}
        </Subtitle>
      </Header>

      <Main>
        <Outlet />
      </Main>

      <BottomNav />
    </>
  );
};

export default CommonLayout;

const Header = styled.div``;

const Brand = styled(Text)``;

const PageTitle = styled(Text)``;

const Subtitle = styled(Text)``;

const Main = styled.main`
  flex: 1;
  min-width: 0;
  padding-bottom: 72px;
`;
