import styled from 'styled-components';
import { useAnalytics } from '../../hooks/analytics/useAnalytics';
import { colors } from '../../theme/palette';
import { yen } from '../../util/expense';

const AnalyticsPage = () => {
  const analytics = useAnalytics();
  const { data, presentation } = analytics;
  return (
    <Page>
      <MonthNav aria-label="表示する月">
        <Arrow onClick={analytics.previousMonth} aria-label="前の月">
          <Chevron $previous />
        </Arrow>
        <strong>{analytics.monthLabel}</strong>
        <Arrow
          onClick={analytics.nextMonth}
          disabled={!analytics.canMoveNext}
          aria-label="次の月"
        >
          <Chevron />
        </Arrow>
      </MonthNav>
      {analytics.loading ? (
        <Card role="status">分析データを読み込み中...</Card>
      ) : analytics.error ? (
        <Card role="alert">
          <p>{analytics.error}</p>
          <Action onClick={analytics.reload}>再読み込み</Action>
        </Card>
      ) : (
        data &&
        presentation && (
          <>
            <Card>
              <Muted>
                {analytics.isCurrentMonth ? '今月' : 'この月'}の支出
              </Muted>
              <Total>{yen.format(data.monthlySpent)}</Total>
              {data.budget !== null ? (
                <>
                  <BudgetRow>
                    <Muted>予算 {yen.format(data.budget)}</Muted>
                    <Remaining
                      $over={
                        data.remainingBudget !== null &&
                        data.remainingBudget < 0
                      }
                    >
                      残り{' '}
                      {data.remainingBudget === null
                        ? '—'
                        : yen.format(data.remainingBudget)}
                    </Remaining>
                  </BudgetRow>
                  <Track
                    role="progressbar"
                    aria-label="予算に対する支出"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={presentation.budgetProgress}
                  >
                    <Fill
                      $width={presentation.budgetProgress}
                      $color={
                        data.remainingBudget !== null &&
                        data.remainingBudget < 0
                          ? colors.danger
                          : colors.primary
                      }
                    />
                  </Track>
                </>
              ) : (
                <Muted>予算未設定</Muted>
              )}
            </Card>
            <Card>
              <SectionHeader>
                <h2>日別の支出</h2>
                <Muted>タップで詳細</Muted>
              </SectionHeader>
              {presentation.hasDatedExpenses ? (
                <>
                  <Chart aria-label="日別のカテゴリー別支出">
                    {presentation.baseline !== null && (
                      <Baseline $position={presentation.baselinePosition}>
                        <span>1日目安 {yen.format(presentation.baseline)}</span>
                      </Baseline>
                    )}
                    <Bars>
                      {presentation.days.map((day) => (
                        <BarButton
                          key={day.date}
                          type="button"
                          onClick={() => analytics.selectDay(day.date)}
                          aria-label={`${day.dayNumber}日、支出${yen.format(day.totalAmount)}`}
                          aria-pressed={analytics.selectedDate === day.date}
                          disabled={day.future}
                          $selected={analytics.selectedDate === day.date}
                        >
                          {day.segments.map((segment) => (
                            <Segment
                              key={segment.category.id}
                              $height={segment.height}
                              $color={segment.category.color}
                            />
                          ))}
                          {day.totalAmount === 0 && <ZeroMark />}
                        </BarButton>
                      ))}
                    </Bars>
                  </Chart>
                  <Axis>
                    <span>1日</span>
                    <span>{presentation.days.length}日</span>
                  </Axis>
                </>
              ) : (
                <EmptyChart>
                  <p>
                    {data.undatedSpent > 0
                      ? '日付が設定された支出はありません。'
                      : 'この月の支出はまだありません。'}
                  </p>
                </EmptyChart>
              )}
              {analytics.selectedDay && (
                <DayDetails aria-live="polite">
                  <strong>
                    {analytics.selectedLabel}の支出{' '}
                    {yen.format(analytics.selectedDay.totalAmount)}
                  </strong>
                  {analytics.selectedDay.categories.map((item) => (
                    <DailyRow key={item.category.id}>
                      <span>
                        <Dot $color={item.category.color} />
                        {item.category.name}
                      </span>
                      <b>{yen.format(item.amount)}</b>
                    </DailyRow>
                  ))}
                  {analytics.selectedDay.totalAmount === 0 && (
                    <Muted>この日の支出はありません。</Muted>
                  )}
                </DayDetails>
              )}
            </Card>
            <Card>
              <SectionHeader>
                <h2>カテゴリー別</h2>
                <Muted>月全体の割合</Muted>
              </SectionHeader>
              {presentation.categories.length ? (
                presentation.categories.map((item) => (
                  <CategoryButton
                    key={item.category.id}
                    type="button"
                    onClick={() => analytics.openHistory(item.category.id)}
                    aria-label={`${item.category.name}、${yen.format(item.amount)}の履歴を見る`}
                  >
                    <CategoryRow>
                      <CategoryName>
                        <Dot $color={item.category.color} />
                        {item.category.name}
                      </CategoryName>
                      <CategoryAmount>
                        {yen.format(item.amount)}{' '}
                        <small>{item.percentage.toFixed(1)}%</small>
                      </CategoryAmount>
                    </CategoryRow>
                    <Track>
                      <Fill $width={item.width} $color={item.category.color} />
                    </Track>
                  </CategoryButton>
                ))
              ) : (
                <EmptyMessage>この月の支出はまだありません。</EmptyMessage>
              )}
              <Muted>日付未設定の支出：{yen.format(data.undatedSpent)}</Muted>
            </Card>
            <HistoryButton
              type="button"
              onClick={() => analytics.openHistory()}
            >
              この月の支出履歴を見る →
            </HistoryButton>
          </>
        )
      )}
    </Page>
  );
};
export default AnalyticsPage;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 16px;
  color: ${colors.text};
`;
const MonthNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  strong {
    display: flex;
    align-items: center;
    min-height: 32px;
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
  width: 7px;
  height: 7px;
  border-top: 1.5px solid currentColor;
  border-right: 1.5px solid currentColor;
  transform: rotate(${({ $previous }) => ($previous ? '-135deg' : '45deg')});
`;
const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding: 18px;
  border: 1px solid ${colors.borderSubtle};
  border-radius: 18px;
  background: ${colors.surface};
  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.8;
  }
`;
const Muted = styled.span`
  font-size: 12px;
  line-height: 1.7;
  color: ${colors.textMuted};
`;
const Total = styled.strong`
  font-size: 30px;
  line-height: 1.2;
  overflow-wrap: anywhere;
`;
const BudgetRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
`;
const Remaining = styled.strong<{ $over: boolean }>`
  font-size: 12px;
  color: ${({ $over }) => ($over ? colors.danger : colors.primary)};
`;
const Track = styled.div`
  height: 6px;
  border-radius: 8px;
  overflow: hidden;
  background: ${colors.borderSubtle};
`;
const Fill = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  border-radius: inherit;
  background: ${({ $color }) => $color};
`;
const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  h2 {
    margin: 0;
    font-size: 16px;
  }
`;
const Chart = styled.div`
  height: 168px;
  position: relative;
  margin-top: 28px;
`;
const Bars = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  gap: 2px;
  align-items: stretch;
  border-bottom: 1px solid ${colors.borderSubtle};
`;
const BarButton = styled.button<{ $selected: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  background: ${({ $selected }) => ($selected ? colors.primarySoft : 'transparent')};
  border-radius: 3px 3px 0 0;
  cursor: pointer;
  outline-offset: 2px;
  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
  &:focus-visible {
    outline: 2px solid ${colors.primary};
    z-index: 2;
  }
`;
const Segment = styled.span<{ $height: number; $color: string }>`
  display: block;
  flex-shrink: 0;
  width: 100%;
  height: ${({ $height }) => $height}%;
  background: ${({ $color }) => $color};
  pointer-events: none;
`;
const ZeroMark = styled.span`
  display: block;
  width: 100%;
  height: 2px;
  background: ${colors.border};
  pointer-events: none;
`;
const Baseline = styled.div<{ $position: number }>`
  position: absolute;
  z-index: 3;
  left: 0;
  right: 0;
  bottom: ${({ $position }) => $position}%;
  border-top: 1px dashed ${colors.primary};
  pointer-events: none;
  span {
    position: absolute;
    right: 0;
    bottom: 4px;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 10px;
    color: ${colors.primary};
    background: ${colors.surface};
  }
`;
const Axis = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: -8px;
  font-size: 11px;
  color: ${colors.textMuted};
`;
const EmptyChart = styled.div`
  min-height: 150px;
  display: grid;
  place-items: center;
  padding: 16px;
  color: ${colors.textMuted};
  text-align: center;
`;
const DayDetails = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 10px;
  background: ${colors.primarySoft};
  > strong {
    font-size: 12px;
    color: ${colors.primary};
  }
`;
const DailyRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;
const CategoryButton = styled.button`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: ${colors.text};
  cursor: pointer;
  text-align: left;
  > ${Track} {
    width: 100%;
  }
`;
const CategoryRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  font-size: 13px;
`;
const CategoryName = styled.span`
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  overflow-wrap: anywhere;
`;
const CategoryAmount = styled.strong`
  flex-shrink: 0;
  text-align: right;
  small {
    font-size: 10px;
    color: ${colors.textMuted};
    font-weight: 400;
  }
`;
const Dot = styled.i<{ $color: string }>`
  display: inline-block;
  flex-shrink: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;
const EmptyMessage = styled.p`
  text-align: center;
  padding: 24px 0;
  color: ${colors.textMuted};
`;
const Action = styled.button`
  padding: 12px;
  border: 1px solid ${colors.primaryBorder};
  border-radius: 12px;
  background: ${colors.primarySoft};
  color: ${colors.primary};
  cursor: pointer;
`;
const HistoryButton = styled.button`
  border: 0;
  background: transparent;
  color: ${colors.primary};
  font-size: 12px;
  padding: 12px;
  cursor: pointer;
`;
