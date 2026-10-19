import { useEffect, useRef, useState } from 'react';
import { loadTurnstile, type Turnstile } from '../../util/turnstile';

const publicTestKey = '1x00000000000000000000AA';

export const useTurnstile = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const widget = useRef<{ api: Turnstile; id: string } | null>(null);
  const siteKey =
    import.meta.env.VITE_TURNSTILE_SITE_KEY ||
    (import.meta.env.MODE === 'development' ? publicTestKey : '');
  const configured =
    !!siteKey &&
    (import.meta.env.MODE === 'development' || siteKey !== publicTestKey);

  useEffect(() => {
    setToken('');
    if (!configured) {
      setLoading(false);
      setError('現在、認証を利用できません。時間をおいてお試しください。');
      return;
    }
    if (!container) return;
    let active = true;
    setLoading(true);
    setError('');
    loadTurnstile()
      .then((api) => {
        if (!active) return;
        const expired = () => {
          if (active) setToken('');
        };
        const id = api.render(container, {
          sitekey: siteKey,
          action: 'password_reset',
          language: 'ja',
          size: 'flexible',
          theme: 'light',
          callback: (value) => {
            if (!active) return;
            setToken(value);
            setError('');
            setLoading(false);
          },
          'expired-callback': expired,
          'timeout-callback': expired,
          'error-callback': () => {
            if (!active) return;
            setToken('');
            setLoading(false);
            setError('認証を読み込めませんでした。再読み込みしてください。');
          },
        });
        widget.current = { api, id };
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
        setError('認証を読み込めませんでした。通信状況を確認してください。');
      });
    return () => {
      active = false;
      const current = widget.current;
      widget.current = null;
      if (current) current.api.remove(current.id);
    };
  }, [container, configured, siteKey, revision]);

  return {
    setContainer,
    token,
    error,
    loading,
    configured,
    retry: () => setRevision((value) => value + 1),
    reset: () => {
      setToken('');
      const current = widget.current;
      if (current) current.api.reset(current.id);
    },
  };
};
