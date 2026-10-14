import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../../theme/palette';

const BottomNav = () => {
  return (
    <Navigation aria-label="メインナビゲーション">
      <NavItem to="/home" end aria-label="ホーム">
        <NavIcon viewBox="0 0 24 24" aria-hidden="true">
          <path d="m3.5 10 8.5-7 8.5 7v10a1 1 0 0 1-1 1h-5v-7h-5v7h-5a1 1 0 0 1-1-1V10Z" />
        </NavIcon>
        <Label>ホーム</Label>
      </NavItem>

      <NavItem to="/add" aria-label="支出を記録">
        <NavIcon viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M12 8v8M8 12h8" />
        </NavIcon>
        <Label>記録</Label>
      </NavItem>

      <NavItem to="/history" aria-label="履歴">
        <NavIcon viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" />
          <path d="M7 4v4M7 10v4M7 16v4" />
        </NavIcon>
        <Label>履歴</Label>
      </NavItem>

      <NavItem to="/analytics" aria-label="分析">
        <NavIcon viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 20V13h4v7M10 20V8h4v12M16 20V4h4v16" />
        </NavIcon>
        <Label>分析</Label>
      </NavItem>

      <NavItem to="/setting" aria-label="設定">
        <NavIcon viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
          <circle cx="9" cy="7" r="2" fill={colors.surfaceRaised} />
          <circle cx="15" cy="12" r="2" fill={colors.surfaceRaised} />
          <circle cx="10" cy="17" r="2" fill={colors.surfaceRaised} />
        </NavIcon>
        <Label>設定</Label>
      </NavItem>
    </Navigation>
  );
};

export default BottomNav;

const Navigation = styled.nav`
  position: fixed;
  z-index: 100;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);

  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));

  width: 100%;
  max-width: 430px;
  min-height: calc(72px + env(safe-area-inset-bottom));
  padding: 8px 12px calc(8px + env(safe-area-inset-bottom));

  border-top: 1px solid ${colors.borderSubtle};
  background: ${colors.surfaceRaised};
`;

const NavItem = styled(NavLink)`
  display: flex;
  min-height: 48px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  border-radius: 10px;
  color: ${colors.textSubtle};
  text-decoration: none;

  transition:
    background-color 160ms ease,
    color 160ms ease;

  &[aria-current='page'] {
    background: ${colors.navActiveBackground};
    color: ${colors.navActive};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

const NavIcon = styled.svg`
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
`;

const Label = styled.span`
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
`;
