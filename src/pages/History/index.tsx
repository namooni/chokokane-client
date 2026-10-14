import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useHistory } from '../../hooks/expenses/useHistory';
import { expenseMonth, sortHistory } from '../../util/history';
import { getTodayJST } from '../../util/date';
import { yen, type ExpenseContent } from '../../util/expense';
import { colors } from '../../theme/palette';
import { ExpenseEditSheet } from '../../components/expenses/ExpenseEditSheet';

const HistoryPage = () => {
  const { items, loading, error, reload } = useHistory();
  const [month, setMonth] = useState(() => getTodayJST().slice(0, 7));
  const [filter, setFilter] = useState('all');
  const [limit, setLimit] = useState(20);
  const [editing, setEditing] = useState<ExpenseContent | null>(null);
  const [toast, setToast] = useState('');
  const monthly = sortHistory(
    items.filter((item) => expenseMonth(item) === month),
  );
  const categories = [
    ...new Map(
      monthly.map((item) => [item.category.id, item.category]),
    ).values(),
  ];
  const effective =
    filter === 'all' ||
    filter === 'undated' ||
    categories.some((item) => String(item.id) === filter)
      ? filter
      : 'all';
  const filtered = monthly.filter(
    (item) =>
      effective === 'all' ||
      (effective === 'undated'
        ? !item.expenseDate
        : String(item.category.id) === effective),
  );
  const groups = new Map<string, ExpenseContent[]>();
  filtered.slice(0, limit).forEach((item) => {
    const key = item.expenseDate ?? 'undated';
    groups.set(key, [...(groups.get(key) ?? []), item]);
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (!loading) setFilter(effective);
  }, [effective, loading]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const move = (offset: number) => {
    const [year, number] = month.split('-').map(Number);
    setMonth(
      new Date(Date.UTC(year, number - 1 + offset, 1))
        .toISOString()
        .slice(0, 7),
    );
    setLimit(20);
  };
  const [year, number] = month.split('-').map(Number);
  return (
    <Page>
      <MonthNav aria-label="表示する月">
        <Arrow onClick={() => move(-1)} aria-label="前の月">
          ‹
        </Arrow>
        <strong>
          {year}年{number}月
        </strong>
        <Arrow
          onClick={() => move(1)}
          aria-label="次の月"
          disabled={month >= getTodayJST().slice(0, 7)}
        >
          ›
        </Arrow>
      </MonthNav>
      {loading ? (
        <State role="status">支出履歴を読み込み中...</State>
      ) : error ? (
        <State role="alert">
          <p>{error}</p>
          <Chip onClick={reload}>再読み込み</Chip>
        </State>
      ) : (
        <>
          <Summary>
            <Muted>
              {month === getTodayJST().slice(0, 7) ? '今月' : `${number}月`}
              の支出合計
            </Muted>
            <Total>
              {yen.format(monthly.reduce((sum, item) => sum + item.amount, 0))}
            </Total>
            <Muted>すべての支出を含む合計</Muted>
          </Summary>
          {!!monthly.length && (
            <Filters aria-label="支出の絞り込み">
              {[
                { id: 'all', name: 'すべて' },
                ...categories.map((item) => ({
                  id: String(item.id),
                  name: item.name,
                })),
                { id: 'undated', name: '日付未設定' },
              ].map((item) => (
                <Chip
                  key={item.id}
                  $active={effective === item.id}
                  aria-pressed={effective === item.id}
                  onClick={() => {
                    setFilter(item.id);
                    setLimit(20);
                  }}
                >
                  {item.name}
                </Chip>
              ))}
            </Filters>
          )}
          {effective !== 'all' && (
            <Muted>
              {filtered.length}件 · 合計{' '}
              {yen.format(filtered.reduce((sum, item) => sum + item.amount, 0))}
            </Muted>
          )}
          {!filtered.length ? (
            <State>
              <EmptyIcon aria-hidden="true">◇</EmptyIcon>
              <strong>
                {monthly.length
                  ? '条件に一致する支出がありません。'
                  : 'この月の支出はまだありません。'}
              </strong>
              <p>
                {monthly.length
                  ? 'ほかのカテゴリーを選んでください。'
                  : '最初の支出を記録してみましょう。'}
              </p>
              {monthly.length ? (
                <Chip onClick={() => setFilter('all')}>すべて表示</Chip>
              ) : (
                <AddLink to="/add">＋ 支出を記録</AddLink>
              )}
            </State>
          ) : (
            [...groups].map(([date, expenses]) => (
              <section key={date}>
                <DateHeading>
                  {date === 'undated'
                    ? '日付未設定'
                    : `${Number(date.slice(5, 7))}月${Number(date.slice(8))}日`}
                </DateHeading>
                <List>
                  {expenses.map((item) => (
                    <Row
                      key={item.id}
                      onClick={() => setEditing(item)}
                      aria-label={`${item.memo || item.category.name}、${yen.format(item.amount)}を編集`}
                    >
                      <Icon $color={item.category.color}>
                        <Dot $color={item.category.color} />
                      </Icon>
                      <Details>
                        <Name>{item.memo || item.category.name}</Name>
                        <Muted>
                          {item.category.name}
                          {item.expenseTime
                            ? ` · ${item.expenseTime.slice(0, 5)}`
                            : ''}
                        </Muted>
                      </Details>
                      <Amount>−{yen.format(item.amount)}</Amount>
                    </Row>
                  ))}
                </List>
              </section>
            ))
          )}
          {filtered.length > limit && (
            <Chip onClick={() => setLimit((value) => value + 20)}>
              もっと見る
            </Chip>
          )}
        </>
      )}
      {editing && (
        <ExpenseEditSheet
          expense={editing}
          onClose={() => setEditing(null)}
          onSaved={(message) => {
            setEditing(null);
            setToast(message);
            setLimit(20);
            reload();
          }}
        />
      )}
      {toast && (
        <Toast role="status" onClick={() => setToast('')}>
          {toast}
        </Toast>
      )}
    </Page>
  );
};
export default HistoryPage;
const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 16px;
`;
const MonthNav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;
const Arrow = styled.button`
  border: 0;
  background: transparent;
  color: ${colors.textMuted};
  font-size: 24px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;
const Summary = styled.div`
  padding: 18px;
  border: 1px solid ${colors.borderSubtle};
  border-radius: 18px;
  background: ${colors.surface};
`;
const Muted = styled.span`
  display: block;
  color: ${colors.textMuted};
  font-size: 12px;
  line-height: 1.6;
`;
const Total = styled.strong`
  display: block;
  margin: 8px 0;
  font-size: 32px;
`;
const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
const Chip = styled.button<{ $active?: boolean }>`
  border: 1px solid
    ${({ $active }) => ($active ? colors.primary : colors.borderSubtle)};
  border-radius: 24px;
  background: ${({ $active }) => ($active ? colors.primary : colors.surface)};
  color: ${({ $active }) => ($active ? colors.inverse : colors.textSecondary)};
  padding: 8px 20px;
  font-size: 12px;
  cursor: pointer;
  overflow-wrap: anywhere;
`;
const DateHeading = styled.h2`
  font-size: 14px;
  color: ${colors.textMuted};
  margin: 0 2px 8px;
`;
const List = styled.div`
  padding: 0 14px;
  border: 1px solid ${colors.borderSubtle};
  border-radius: 18px;
  background: ${colors.surface};
`;
const Row = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  width: 100%;
  text-align: left;
  border: 0;
  border-bottom: 1px solid ${colors.borderSubtle};
  background: transparent;
  color: ${colors.text};
  cursor: pointer;
  &:last-child {
    border-bottom: 0;
  }
`;
const Icon = styled.span<{ $color: string }>`
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
const Details = styled.span`
  flex: 1;
  min-width: 0;
`;
const Name = styled.strong`
  display: block;
  font-size: 14px;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
`;
const Amount = styled.strong`
  font-size: 14px;
  white-space: nowrap;
`;
const State = styled(Summary)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
  gap: 16px;
  p {
    color: ${colors.textMuted};
    font-size: 12px;
    margin: 0;
  }
`;
const EmptyIcon = styled.span`
  font-size: 64px;
  color: ${colors.primaryBorder};
`;
const AddLink = styled(Link)`
  display: block;
  padding: 14px 32px;
  border-radius: 12px;
  background: ${colors.primary};
  color: ${colors.inverse};
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  margin-top: 12px;
`;
const Toast = styled.button`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3000;
  width: calc(100% - 32px);
  max-width: 398px;
  border: 1px solid ${colors.primaryBorder};
  border-radius: 12px;
  padding: 14px;
  background: ${colors.successSoft};
  color: ${colors.success};
  cursor: pointer;
`;
