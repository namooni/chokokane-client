import styled from 'styled-components';
import { Expense, yen } from '../util/expense';

type ExpenseOverviewProps = { expenses: Expense };

export const ExpenseOverview = ({ expenses }: ExpenseOverviewProps) => {
  const { content, totalAmount } = expenses;
  const categoryTotals = content.reduce<Record<string, number>>(
    (totals, expense) => {
      totals[expense.category] =
        (totals[expense.category] ?? 0) + expense.amount;
      return totals;
    },
    {},
  );
  const topCategory =
    Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-';

  return (
    <>
      <Hero>
        <div>
          <Eyebrow>EXPENSE OVERVIEW</Eyebrow>
          <HeroTitle>
            お金の流れを
            <br />
            気軽に記録しましょう。
          </HeroTitle>
          <HeroCopy>
            今日の支出を記録し、どこに最も使っているかを一目で確認できます。
          </HeroCopy>
        </div>
        <HeroCard>
          <HeroCardLabel>Total spending</HeroCardLabel>
          <HeroCardValue>{yen.format(totalAmount)}</HeroCardValue>
          <HeroCardMeta>{expenses.totalElements} transactions</HeroCardMeta>
        </HeroCard>
      </Hero>
      <Stats>
        <Stat>
          <StatLabel>合計支出</StatLabel>
          <StatValue>{yen.format(totalAmount)}</StatValue>
        </Stat>
        <Stat>
          <StatLabel>支出件数</StatLabel>
          <StatValue>
            {expenses.totalElements}
            <StatUnit>件</StatUnit>
          </StatValue>
        </Stat>
        <Stat>
          <StatLabel>最大のカテゴリ</StatLabel>
          <StatValue>{topCategory}</StatValue>
        </Stat>
      </Stats>
    </>
  );
};

const Hero = styled.section`
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  gap: 60px;
  padding: 72px 0 52px;
  align-items: end;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    padding-top: 45px;
  }

  @media (max-width: 500px) {
    gap: 28px;
  }
`;

const Eyebrow = styled.p`
  font-size: 11px;
  letter-spacing: 0.18em;
  font-weight: 700;
  color: #69736d;
`;

const HeroTitle = styled.h1`
  font-size: clamp(42px, 6vw, 72px);
  line-height: 1.04;
  letter-spacing: -0.055em;
  margin: 12px 0 24px;
  font-weight: 600;

  @media (max-width: 500px) {
    font-size: 42px;
  }
`;

const HeroCopy = styled.p`
  max-width: 500px;
  color: #69736d;
  line-height: 1.75;
`;

const HeroCard = styled.div`
  background: #163c2c;
  color: #f7f2e7;
  border-radius: 24px;
  padding: 30px;
  min-height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: 0 18px 50px #163c2c18;
`;

const HeroCardLabel = styled.span`
  color: #b8c9bf;
`;

const HeroCardValue = styled.strong`
  font-size: 38px;
  letter-spacing: -0.04em;
  margin: 8px 0;
`;

const HeroCardMeta = styled.small`
  color: #b8c9bf;
`;

const Stats = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid #d8d5ca;
  border-bottom: 1px solid #d8d5ca;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled.article`
  padding: 24px 0;

  & + & {
    border-left: 1px solid #d8d5ca;
    padding-left: 28px;
  }

  @media (max-width: 800px) {
    & + & {
      border-left: 0;
      border-top: 1px solid #d8d5ca;
      padding-left: 0;
    }
  }
`;

const StatLabel = styled.span`
  display: block;
  color: #788079;
  font-size: 13px;
  margin-bottom: 7px;
`;

const StatValue = styled.strong`
  font-size: 23px;
`;

const StatUnit = styled.small`
  font-size: 13px;
  margin-left: 4px;
`;
