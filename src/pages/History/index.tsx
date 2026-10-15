import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useHistoryPage } from '../../hooks/expenses/useHistoryPage';
import { yen } from '../../util/expense';
import { colors } from '../../theme/palette';
import { ExpenseEditSheet } from '../../components/expenses/ExpenseEditSheet';

const HistoryPage = () => {
  const {
    loading,
    error,
    reload,
    year,
    number,
    move,
    effective,
    filterOptions,
    selectFilter,
    monthlyTotal,
    filteredTotal,
    hasMonthly,
    filteredCount,
    groups,
    hasMore,
    loadingMore,
    moreError,
    retryMore,
    sentinelRef,
    editing,
    startEdit,
    closeEdit,
    onSaved,
    toast,
    dismissToast,
    isCurrentMonth,
    canMoveNext,
  } = useHistoryPage();

  return (
    <Page>
      <MonthNav aria-label="表示する月">
        <Arrow onClick={() => move(-1)} aria-label="前の月">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m14 6-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Arrow>
        <strong>
          {year}年{number}月
        </strong>
        <Arrow
          onClick={() => move(1)}
          aria-label="次の月"
          disabled={!canMoveNext}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m10 6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
              {isCurrentMonth ? '今月' : `${number}月`}
              の支出合計
            </Muted>
            <Total>{yen.format(monthlyTotal)}</Total>
            <Muted>すべての支出を含む合計</Muted>
          </Summary>
          {hasMonthly && (
            <Filters aria-label="支出の絞り込み">
              {filterOptions.map((item) => (
                <Chip
                  key={item.id}
                  $active={effective === item.id}
                  aria-pressed={effective === item.id}
                  onClick={() => selectFilter(item.id)}
                >
                  {item.name}
                </Chip>
              ))}
            </Filters>
          )}
          {effective !== 'all' && (
            <Muted>絞り込み合計 {yen.format(filteredTotal)}</Muted>
          )}
          {!filteredCount ? (
            <State>
              <EmptyIcon aria-hidden="true">◇</EmptyIcon>
              <strong>
                {hasMonthly
                  ? '条件に一致する支出がありません。'
                  : 'この月の支出はまだありません。'}
              </strong>
              <p>
                {hasMonthly
                  ? 'ほかのカテゴリーを選んでください。'
                  : '最初の支出を記録してみましょう。'}
              </p>
              {hasMonthly ? (
                <Chip onClick={() => selectFilter('all')}>すべて表示</Chip>
              ) : (
                <AddLink to="/add">＋ 支出を記録</AddLink>
              )}
            </State>
          ) : (
            groups.map(([date, expenses]) => (
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
                      onClick={() => startEdit(item)}
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
          {moreError && (
            <State role="alert">
              <p>{moreError}</p>
              <Chip onClick={retryMore} disabled={loadingMore}>
                再読み込み
              </Chip>
            </State>
          )}
          {hasMore && <ScrollSentinel ref={sentinelRef} aria-hidden="true" />}
          {loadingMore && (
            <ScrollStatus role="status">続きを読み込み中...</ScrollStatus>
          )}
          {!hasMore && filteredCount > 0 && (
            <ScrollStatus>すべての支出を表示しました</ScrollStatus>
          )}
        </>
      )}
      {editing && (
        <ExpenseEditSheet
          expense={editing}
          onClose={closeEdit}
          onSaved={onSaved}
        />
      )}
      {toast && (
        <Toast role="status" onClick={dismissToast}>
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
const ScrollSentinel = styled.div`
  height: 1px;
`;
const ScrollStatus = styled.p`
  margin: 0;
  padding: 12px;
  text-align: center;
  color: ${colors.textMuted};
  font-size: 12px;
`;
const MonthNav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  > strong {
    display: flex;
    align-items: center;
    min-height: 32px;
    line-height: 1;
  }
`;
const Arrow = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
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
