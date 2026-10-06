import { Link } from 'react-router-dom';
import styled from 'styled-components';

const previewRows = [
  { date: '10.05', category: '食費', memo: 'カフェ', amount: '¥680' },
  { date: '10.04', category: '交通', memo: '地下鉄', amount: '¥240' },
  { date: '10.03', category: '日用品', memo: '洗剤', amount: '¥1,280' },
];

export const LandingPage = () => (
  <Page>
    <Topbar>
      <Brand to="/">
        <BrandMark>¥</BrandMark>
        <span>Moneylog</span>
      </Brand>
      <TopActions>
        <LoginLink to="/login">ログイン</LoginLink>
        <StartLink to="/login">
          家計簿をはじめる <span aria-hidden="true">→</span>
        </StartLink>
      </TopActions>
    </Topbar>

    <Hero>
      <HeroInner>
        <HeroEyebrow>YOUR DAILY MONEY, IN FOCUS</HeroEyebrow>
        <HeroTitle>Moneylog</HeroTitle>
        <HeroCopy>毎日の支出を、無理なく見える化。</HeroCopy>
        <HeroDescription>
          使ったお金を記録するだけ。日々の流れが見えて、次の選択が少し楽になります。
        </HeroDescription>
        <HeroActions>
          <HeroButton to="/login">
            ログインして使う <span aria-hidden="true">→</span>
          </HeroButton>
          <PreviewHint>サンプル画面を下に表示しています</PreviewHint>
        </HeroActions>
      </HeroInner>
      <HeroIndex>
        01 <span>/</span> PERSONAL FINANCE
      </HeroIndex>
    </Hero>

    <PreviewSection id="preview">
      <PreviewIntro>
        <div>
          <PreviewEyebrow>LEDGER PREVIEW · SAMPLE DATA</PreviewEyebrow>
          <PreviewTitle>記録は、すっきりシンプルに。</PreviewTitle>
        </div>
        <PreviewDescription>
          サンプル表示です。あなたの記録はログイン後に表示されます。
        </PreviewDescription>
      </PreviewIntro>
      <Ledger>
        <LedgerHeader>
          <LedgerHeading>
            <LedgerMark>¥</LedgerMark>
            <div>
              <strong>今月の支出</strong>
              <span>サンプルデータ</span>
            </div>
          </LedgerHeading>
          <LedgerTotal>¥48,260</LedgerTotal>
        </LedgerHeader>
        <LedgerLabels>
          <span>日付</span>
          <span>カテゴリ・メモ</span>
          <span>金額</span>
        </LedgerLabels>
        {previewRows.map((row) => (
          <LedgerRow key={row.date}>
            <LedgerDate>{row.date}</LedgerDate>
            <LedgerDescription>
              <strong>{row.memo}</strong>
              <span>{row.category}</span>
            </LedgerDescription>
            <LedgerAmount>{row.amount}</LedgerAmount>
          </LedgerRow>
        ))}
      </Ledger>
      <PreviewFooter>
        <span>プライベートな家計簿はログイン後に利用できます。</span>
        <FooterLink to="/login">
          ログイン <span aria-hidden="true">→</span>
        </FooterLink>
      </PreviewFooter>
    </PreviewSection>
    <PageFooter>
      <span>Moneylog</span>
      <span>あなたの毎日に寄り添う家計簿</span>
    </PageFooter>
  </Page>
);

const Page = styled.main`
  min-height: 100vh;
  background: #f3f1e9;
`;
const Topbar = styled.header`
  height: 76px;
  padding: 0 max(28px, calc((100vw - 1180px) / 2));
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f3f1e9;
`;
const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #17211b;
  font-size: 19px;
  font-weight: 700;
  text-decoration: none;
`;
const BrandMark = styled.span`
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  background: #163c2c;
  color: #f8f4e8;
`;
const TopActions = styled.nav`
  display: flex;
  align-items: center;
  gap: 22px;
`;
const LoginLink = styled(Link)`
  color: #37423b;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
`;
const StartLink = styled(LoginLink)`
  padding: 11px 15px;
  border: 1px solid #c7cec5;
  border-radius: 8px;
`;
const Hero = styled.section`
  position: relative;
  display: flex;
  min-height: 460px;
  align-items: center;
  overflow: hidden;
  background: #163c2c;
  color: #f7f2e7;

  &::after {
    position: absolute;
    right: 8%;
    bottom: -210px;
    width: 560px;
    height: 560px;
    border: 1px solid #ffffff1e;
    border-radius: 50%;
    content: '';
    box-shadow:
      0 0 0 48px #ffffff08,
      0 0 0 96px #ffffff06;
    pointer-events: none;
  }

  @media (max-width: 600px) {
    min-height: 475px;
  }
`;
const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 74px 28px 90px;
`;
const HeroEyebrow = styled.p`
  margin: 0 0 20px;
  color: #c4d1c6;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.17em;
`;
const HeroTitle = styled.h1`
  margin: 0;
  font-size: 64px;
  line-height: 1;
  font-weight: 600;

  @media (max-width: 600px) {
    font-size: 52px;
  }
`;
const HeroCopy = styled.p`
  margin: 20px 0 0;
  font-size: 28px;
  line-height: 1.5;
  font-weight: 600;

  @media (max-width: 600px) {
    font-size: 22px;
  }
`;
const HeroDescription = styled.p`
  max-width: 510px;
  margin: 12px 0 0;
  color: #d2ddd3;
  font-size: 14px;
  line-height: 1.9;
`;
const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 28px;

  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }
`;
const HeroButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 24px;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 8px;
  background: #f7f2e7;
  color: #163c2c;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition:
    background 140ms ease,
    transform 140ms ease;

  &:hover {
    transform: translateY(-1px);
    background: #fff;
  }
`;
const PreviewHint = styled.span`
  color: #c4d1c6;
  font-size: 12px;
`;
const HeroIndex = styled.div`
  position: absolute;
  right: max(28px, calc((100vw - 1180px) / 2));
  bottom: 24px;
  color: #c4d1c6;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;

  span {
    padding: 0 5px;
    color: #81988a;
  }
`;
const PreviewSection = styled.section`
  max-width: 1180px;
  margin: 0 auto;
  padding: 54px 28px 60px;

  @media (max-width: 600px) {
    padding-top: 38px;
  }
`;
const PreviewIntro = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
`;
const PreviewEyebrow = styled.p`
  margin: 0 0 8px;
  color: #69736d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
`;
const PreviewTitle = styled.h2`
  margin: 0;
  color: #17211b;
  font-size: 23px;
`;
const PreviewDescription = styled.p`
  margin: 0;
  color: #788079;
  font-size: 12px;
  line-height: 1.7;
`;
const Ledger = styled.div`
  border-top: 1px solid #cfcfc4;
  border-bottom: 1px solid #cfcfc4;
`;
const LedgerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 21px 0;
`;
const LedgerHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  strong,
  span {
    display: block;
  }

  strong {
    color: #17211b;
    font-size: 14px;
  }

  span {
    margin-top: 4px;
    color: #858b86;
    font-size: 11px;
  }
`;
const LedgerMark = styled.div`
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 11px;
  background: #e4e9e2;
  color: #264b38;
  font-weight: 700;
`;
const LedgerTotal = styled.strong`
  color: #163c2c;
  font-size: 23px;
`;
const LedgerLabels = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr auto;
  padding: 10px 8px;
  border-top: 1px solid #e0ded5;
  color: #858b86;
  font-size: 10px;

  span:last-child {
    text-align: right;
  }
`;
const LedgerRow = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr auto;
  align-items: center;
  min-height: 58px;
  padding: 8px;
  border-top: 1px solid #e5e3db;
`;
const LedgerDate = styled.span`
  color: #858b86;
  font-size: 12px;
`;
const LedgerDescription = styled.div`
  strong,
  span {
    display: block;
  }

  strong {
    color: #26352c;
    font-size: 13px;
  }

  span {
    margin-top: 4px;
    color: #858b86;
    font-size: 11px;
  }
`;
const LedgerAmount = styled.strong`
  color: #26352c;
  font-size: 13px;
  white-space: nowrap;
`;
const PreviewFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 18px;
  color: #788079;
  font-size: 12px;

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;
const FooterLink = styled(Link)`
  color: #28533f;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
`;
const PageFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 22px max(28px, calc((100vw - 1180px) / 2));
  border-top: 1px solid #d8d5ca;
  color: #858b86;
  font-size: 11px;

  span:first-child {
    color: #37423b;
    font-weight: 700;
  }
`;
