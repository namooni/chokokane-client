import { useCallback, useEffect, useRef, useState } from 'react';
import {
  historyApi,
  type HistoryResponse,
} from '../../apis/history/historyApi';
import type { ExpenseContent } from '../../util/expense';
import { appendHistoryItems } from '../../util/history';

type Snapshot = {
  key: string;
  data: HistoryResponse | null;
  items: ExpenseContent[];
  loading: boolean;
  loadingMore: boolean;
  error: string;
  moreError: string;
};
const empty = (key: string): Snapshot => ({
  key,
  data: null,
  items: [],
  loading: true,
  loadingMore: false,
  error: '',
  moreError: '',
});

export const useHistory = (month: string, filter: string) => {
  const [revision, setRevision] = useState(0);
  const key = `${month}|${filter}|${revision}`;
  const [snapshot, setSnapshot] = useState<Snapshot>(() => empty(key));
  const snapshotRef = useRef(snapshot);
  const pending = useRef<AbortController | null>(null);
  const publish = useCallback((next: Snapshot) => {
    snapshotRef.current = next;
    setSnapshot(next);
  }, []);

  const fetchPage = useCallback(
    async (cursor?: string) => {
      if (pending.current) return;
      const previous = snapshotRef.current;
      if (cursor && previous.key !== key) return;
      const controller = new AbortController();
      pending.current = controller;
      publish(
        cursor ? { ...previous, loadingMore: true, moreError: '' } : empty(key),
      );
      try {
        const data = await historyApi.list(
          {
            month,
            size: 20,
            categoryId:
              filter !== 'all' && filter !== 'undated'
                ? Number(filter)
                : undefined,
            undated: filter === 'undated',
            cursor,
          },
          controller.signal,
        );
        if (controller.signal.aborted) return;
        if (data.hasNext && (!data.nextCursor || data.nextCursor === cursor))
          throw new Error('Invalid history cursor');
        const items = appendHistoryItems(
          cursor ? previous.items : [],
          data.content,
        );
        publish({
          key,
          data,
          items,
          loading: false,
          loadingMore: false,
          error: '',
          moreError: '',
        });
      } catch {
        if (controller.signal.aborted) return;
        if (cursor)
          publish({
            ...previous,
            loadingMore: false,
            moreError: '続きの支出を読み込めませんでした。',
          });
        else
          publish({
            ...empty(key),
            loading: false,
            error: '支出履歴を読み込めませんでした。もう一度お試しください。',
          });
      } finally {
        if (pending.current === controller) pending.current = null;
      }
    },
    [month, filter, key, publish],
  );

  useEffect(() => {
    pending.current?.abort();
    pending.current = null;
    void fetchPage();
    return () => {
      pending.current?.abort();
      pending.current = null;
    };
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    const current = snapshotRef.current;
    if (
      current.key !== key ||
      current.loading ||
      current.loadingMore ||
      !current.data?.hasNext ||
      !current.data.nextCursor
    )
      return;
    void fetchPage(current.data.nextCursor);
  }, [key, fetchPage]);

  return {
    ...(snapshot.key === key ? snapshot : empty(key)),
    loadMore,
    reload: () => setRevision((value) => value + 1),
  };
};
