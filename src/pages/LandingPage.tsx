import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../theme/palette';
import { Page, Topbar, Brand, BrandMark, BackLink, Footer } from './authStyles';

export const LandingPage = () => (
  <Page>
    <Topbar>
      <Brand to="/">
        <BrandMark>¥</BrandMark>ちょこかね
      </Brand>
      <BackLink to="/login">ログイン</BackLink>
    </Topbar>
    <Hero>
      <Eyebrow>CHOKOKANE</Eyebrow>
      <h1>
        ちょっと記録。
        <br />
        お金に、ゆとり。
      </h1>
      <p>
        毎日の支出を、さっと記録。
        <br />
        自分のペースで、お金の流れを見つめましょう。
      </p>
    </Hero>
    <Preview aria-label="家計簿のサンプル">
      <PreviewHeader>
        <span>今月の支出</span>
        <small>サンプル</small>
      </PreviewHeader>
      <Total>¥12,480</Total>
      <SampleRow>
        <Dot $color={colors.categoryFood} />
        <div>
          <strong>カフェ</strong>
          <span>食費 · 12:40</span>
        </div>
        <b>−¥680</b>
      </SampleRow>
      <SampleRow>
        <Dot $color={colors.categoryTransport} />
        <div>
          <strong>電車</strong>
          <span>交通 · 08:20</span>
        </div>
        <b>−¥220</b>
      </SampleRow>
    </Preview>
    <Features aria-label="ちょこかねでできること">
      <div>
        <strong>さっと記録</strong>
        <span>金額だけでも、気軽にはじめられます。</span>
      </div>
      <div>
        <strong>すっきり振り返る</strong>
        <span>履歴を日付やカテゴリーで確認できます。</span>
      </div>
    </Features>
    <Actions>
      <MainLink to="/signup">はじめる</MainLink>
      <LoginLink to="/login">アカウントをお持ちの方はこちら</LoginLink>
    </Actions>
    <Footer>ちょこかね · あなたの毎日に寄り添う家計簿</Footer>
  </Page>
);
const Hero = styled.section`
  padding: 28px 4px 24px;
  h1 {
    margin: 12px 0 16px;
    color: ${colors.text};
    font-size: 32px;
    line-height: 1.55;
    letter-spacing: -0.04em;
  }
  p {
    color: ${colors.textMuted};
    font-size: 13px;
    line-height: 1.9;
    margin: 0;
  }
`;
const Eyebrow = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: ${colors.primary};
`;
const Preview = styled.section`
  padding: 20px;
  border: 1px solid ${colors.borderSubtle};
  border-radius: 20px;
  background: ${colors.surface};
`;
const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${colors.textMuted};
  font-size: 12px;
  small {
    padding: 4px 8px;
    border-radius: 8px;
    background: ${colors.surfaceSoft};
    font-size: 10px;
  }
`;
const Total = styled.strong`
  display: block;
  margin: 10px 0 16px;
  font-size: 30px;
  color: ${colors.primary};
`;
const SampleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid ${colors.borderSubtle};
  div {
    flex: 1;
  }
  strong,
  span {
    display: block;
  }
  strong,
  b {
    font-size: 13px;
  }
  span {
    margin-top: 4px;
    color: ${colors.textMuted};
    font-size: 11px;
  }
`;
const Dot = styled.i<{ $color: string }>`
  width: 30px;
  height: 30px;
  border: 9px solid ${({ $color }) => $color}20;
  border-radius: 10px;
  background: ${({ $color }) => $color};
  background-clip: padding-box;
`;
const Features = styled.section`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px 4px;
  strong,
  span {
    display: block;
  }
  strong {
    font-size: 14px;
    color: ${colors.text};
  }
  span {
    margin-top: 6px;
    color: ${colors.textMuted};
    font-size: 12px;
    line-height: 1.7;
  }
`;
const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;
const MainLink = styled(Link)`
  display: grid;
  place-items: center;
  min-height: 52px;
  padding: 12px;
  border-radius: 14px;
  background: ${colors.primary};
  color: ${colors.inverse};
  text-decoration: none;
  font-weight: 700;
`;
const LoginLink = styled(Link)`
  display: block;
  padding: 12px 0;
  text-align: center;
  color: ${colors.primary};
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
`;
