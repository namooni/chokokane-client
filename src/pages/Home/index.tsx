import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../../theme/palette';
import { yen } from '../../util/expense';
import { useHomeDashboard } from '../../hooks/home/useHomeDashboard';
import { BudgetEditSheet } from '../../components/budget/BudgetEditSheet';

const HomePage = () => {
  const home = useHomeDashboard();
  const { data } = home;
  return (
    <Page>
      <MonthNav aria-label="表示する月">
        <Arrow onClick={home.previousMonth} aria-label="前の月">
          <Chevron $previous />
        </Arrow>
        <strong>{home.monthLabel}</strong>
        <Arrow
          onClick={home.nextMonth}
          disabled={!home.canMoveNext}
          aria-label="次の月"
        >
          <Chevron />
        </Arrow>
      </MonthNav>
      {home.loading ? (
        <Card role="status">ホームを読み込み中...</Card>
      ) : home.error ? (
        <Card role="alert">
          <p>{home.error}</p>
          <Retry onClick={home.reload}>再読み込み</Retry>
          <InlineLink to="/history">支出履歴を見る →</InlineLink>
        </Card>
      ) : (
        data && (
          <>
            {home.noBudget ? (
              <Card>
                <Caption>
                  {home.isCurrentMonth ? '今月' : 'この月'}の予算
                </Caption>
                <UnsetTitle>まだ設定されていません</UnsetTitle>
                <Description>
                  予算を設定すると、残り金額と
                  <br />
                  1日あたりの目安が表示されます。
                </Description>
                <BudgetAction onClick={home.openBudget}>
                  予算を設定する →
                </BudgetAction>
              </Card>
            ) : (
              <BudgetCard $over={home.overBudget}>
                <Caption>
                  {home.isCurrentMonth
                    ? '今月あと使えるお金'
                    : 'この月の残り予算'}
                </Caption>
                <Remaining $over={home.overBudget}>
                  {data.remainingBudget === null
                    ? '—'
                    : yen.format(data.remainingBudget)}
                </Remaining>
                <Progress
                  role="progressbar"
                  aria-label="予算に対する支出"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={home.progress}
                  $over={home.overBudget}
                >
                  <ProgressFill
                    $width={home.progress}
                    $over={home.overBudget}
                  />
                </Progress>
                <BudgetDetails>
                  <div>
                    <Caption>使った</Caption>
                    <strong>{yen.format(data.monthlySpent)}</strong>
                  </div>
                  <div>
                    <Caption>
                      {home.isCurrentMonth ? '今月' : 'この月'}の予算
                    </Caption>
                    <strong>
                      {data.budget === null ? '—' : yen.format(data.budget)}
                    </strong>
                  </div>
                </BudgetDetails>
                <EditBudget
                  type="button"
                  onClick={home.openBudget}
                  $over={home.overBudget}
                >
                  予算を変更
                </EditBudget>
                {home.overBudget && (
                  <OverNotice>
                    予算を{' '}
                    {data.remainingBudget === null
                      ? '—'
                      : yen.format(Math.abs(data.remainingBudget))}{' '}
                    超えています
                  </OverNotice>
                )}
              </BudgetCard>
            )}
            {home.noBudget || !home.isCurrentMonth ? (
              <Card>
                <Caption>
                  {home.isCurrentMonth ? '今月' : 'この月'}の支出
                </Caption>
                <Amount>{yen.format(data.monthlySpent)}</Amount>
              </Card>
            ) : null}
            {home.isCurrentMonth && (
              <Metrics $stacked={home.noBudget || home.overBudget}>
                {!home.noBudget && (
                  <Card>
                    <Caption>1日使える</Caption>
                    <Amount>
                      {data.dailySpendable === null
                        ? '—'
                        : yen.format(data.dailySpendable)}
                    </Amount>
                    <MetricNote $tone="success">今日から月末まで</MetricNote>
                  </Card>
                )}
                <Card>
                  <Caption>今日の支出</Caption>
                  <Amount>
                    {data.todaySpent === null
                      ? '—'
                      : yen.format(data.todaySpent)}
                  </Amount>
                  <MetricNote $tone={home.todayTone}>
                    {home.comparison}
                  </MetricNote>
                </Card>
              </Metrics>
            )}
            {home.pace && (
              <Pace $status={data.status} role="status">
                <strong>{home.pace.title}</strong>
                <p>{home.pace.description}</p>
              </Pace>
            )}
            <section>
              <RecentHeader>
                <h2>最近の支出</h2>
                <InlineLink to="/history">すべて見る →</InlineLink>
              </RecentHeader>
              {home.recentExpenses.length ? (
                <RecentList>
                  {home.recentExpenses.map((item) => (
                    <RecentRow key={item.id}>
                      <CategoryIcon $color={item.category.color}>
                        <Dot $color={item.category.color} />
                      </CategoryIcon>
                      <Details>
                        <strong>{item.title}</strong>
                        <Caption>
                          {item.category.name} · {item.dateLabel}
                        </Caption>
                      </Details>
                      <RecentAmount>−{yen.format(item.amount)}</RecentAmount>
                    </RecentRow>
                  ))}
                </RecentList>
              ) : (
                <Card>
                  <Description>この月の支出はまだありません。</Description>
                  <ActionLink to="/add">＋ 支出を記録</ActionLink>
                </Card>
              )}
            </section>
          </>
        )
      )}
      {home.budgetOpen && data && (
        <BudgetEditSheet
          month={home.month}
          budget={data.budget}
          onClose={home.closeBudget}
          onSaved={home.onBudgetSaved}
        />
      )}
      {home.toast && (
        <Toast role="status" onClick={home.dismissToast}>
          {home.toast}
        </Toast>
      )}
    </Page>
  );
};
export default HomePage;
const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;
  color: ${colors.text};
`;
const MonthNav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  strong {
    display: flex;
    align-items: center;
    min-height: 32px;
    font-size: 16px;
    line-height: 1;
  }
`;
const Arrow = styled.button`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${colors.textMuted};
  cursor: pointer;
  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;
const Chevron = styled.span<{ $previous?: boolean }>`
  display: block;
  width: 7px;
  height: 7px;
  border-top: 1.5px solid currentColor;
  border-right: 1.5px solid currentColor;
  transform: rotate(${({ $previous }) => ($previous ? '-135deg' : '45deg')});
`;
const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  border: 1px solid ${colors.borderSubtle};
  border-radius: 18px;
  background: ${colors.surface};
  min-width: 0;
  p {
    margin: 0;
    line-height: 1.8;
    font-size: 13px;
  }
`;
const Caption = styled.span`
  display: block;
  font-size: 12px;
  color: ${colors.textMuted};
  line-height: 1.6;
`;
const BudgetCard = styled(Card)<{ $over: boolean }>`
  background: ${({ $over }) => ($over ? colors.surface : colors.budgetCard)};
  color: ${({ $over }) => ($over ? colors.text : colors.budgetCardText)};
  border-color: ${({ $over }) => ($over ? colors.borderSubtle : colors.budgetCard)};
  ${Caption} {
    color: ${({ $over }) => ($over ? colors.textMuted : colors.textSoft)};
  }
`;
const Remaining = styled.strong<{ $over: boolean }>`
  font-size: clamp(30px, 9vw, 40px);
  color: ${({ $over }) => ($over ? colors.danger : colors.budgetCardText)};
  overflow-wrap: anywhere;
`;
const Progress = styled.div<{ $over: boolean }>`
  height: 9px;
  overflow: hidden;
  border-radius: 16px;
  margin: 8px 0;
  background: ${({ $over }) => ($over ? colors.dangerSoft : colors.budgetCardAccent)};
`;
const ProgressFill = styled.div<{ $width: number; $over: boolean }>`
  height: 100%;
  border-radius: inherit;
  width: ${({ $width }) => $width}%;
  background: ${({ $over }) => ($over ? colors.danger : colors.budgetCardProgress)};
`;
const BudgetDetails = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  strong {
    display: block;
    margin-top: 3px;
    font-size: 16px;
    overflow-wrap: anywhere;
  }
  > div:last-child {
    text-align: right;
  }
`;
const OverNotice = styled.p`
  margin-top: 8px !important;
  padding: 10px;
  border-radius: 12px;
  text-align: center;
  background: ${colors.dangerSoft};
  color: ${colors.danger};
  font-weight: 700;
`;
const Metrics = styled.div<{ $stacked: boolean }>`
  display: grid;
  grid-template-columns: ${({ $stacked }) => ($stacked ? '1fr' : 'repeat(2, minmax(0, 1fr))')};
  gap: 10px;
`;
const Amount = styled.strong`
  display: block;
  font-size: clamp(21px, 6vw, 26px);
  line-height: 1.4;
  overflow-wrap: anywhere;
`;
const MetricNote = styled.span<{ $tone: 'neutral' | 'success' | 'danger' }>`
  font-size: 11px;
  line-height: 1.6;
  color: ${({ $tone }) => ($tone === 'neutral' ? colors.textMuted : colors[$tone])};
`;
const UnsetTitle = styled.h2`
  font-size: 21px;
  margin: 12px 0 0;
`;
const Description = styled.p`
  color: ${colors.textMuted};
  font-size: 13px;
  line-height: 1.8;
`;
const ActionLink = styled(Link)`
  display: block;
  padding: 13px;
  margin-top: 8px;
  background: ${colors.primary};
  color: ${colors.inverse};
  border-radius: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
`;
const BudgetAction = styled.button`
  padding: 13px;
  margin-top: 8px;
  border: 0;
  border-radius: 12px;
  background: ${colors.primary};
  color: ${colors.inverse};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;
const EditBudget = styled.button<{ $over: boolean }>`
  align-self: flex-end;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: ${({ $over }) => ($over ? colors.primary : colors.budgetCardText)};
  font-size: 12px;
  cursor: pointer;
`;
const Toast = styled.button`
  position: fixed;
  z-index: 3000;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 398px;
  padding: 14px;
  border: 1px solid ${colors.primaryBorder};
  border-radius: 12px;
  background: ${colors.successSoft};
  color: ${colors.success};
  cursor: pointer;
`;
const InlineLink = styled(Link)`
  color: ${colors.primary};
  font-size: 12px;
  text-decoration: none;
  padding: 8px 0;
`;
const Retry = styled.button`
  padding: 12px;
  border: 1px solid ${colors.primaryBorder};
  border-radius: 12px;
  background: ${colors.primarySoft};
  color: ${colors.primary};
  cursor: pointer;
`;
const Pace = styled(Card)<{ $status: string }>`
  border: 0;
  background: ${({ $status }) => ($status === 'OVER' ? colors.dangerSoft : $status === 'WARNING' ? colors.warningSoft : colors.primarySoft)};
  color: ${({ $status }) => ($status === 'OVER' ? colors.danger : $status === 'WARNING' ? colors.warning : colors.primary)};
  strong {
    font-size: 14px;
  }
  p {
    font-size: 12px;
  }
`;
const RecentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  h2 {
    font-size: 16px;
    margin: 0;
  }
`;
const RecentList = styled.div`
  display: flex;
  flex-direction: column;
`;
const RecentRow = styled.article`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
`;
const CategoryIcon = styled.span<{ $color: string }>`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  background: ${({ $color }) => $color}20;
`;
const Dot = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;
const Details = styled.div`
  flex: 1;
  min-width: 0;
  strong {
    display: block;
    font-size: 14px;
    overflow-wrap: anywhere;
  }
`;
const RecentAmount = styled.strong`
  font-size: 14px;
  white-space: nowrap;
`;
