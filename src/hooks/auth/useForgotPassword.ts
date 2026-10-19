import { useEffect, useRef, useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { passwordResetApi } from '../../apis/auth/passwordResetApi';
import { useTurnstile } from './useTurnstile';

export const useForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nextAllowedAt, setNextAllowedAt] = useState(0);
  const [now, setNow] = useState(Date.now);
  const pending = useRef(false);
  const captcha = useTurnstile();
  const secondsLeft = Math.max(0, Math.ceil((nextAllowedAt - now) / 1000));

  useEffect(() => {
    if (!nextAllowedAt) return;
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= nextAllowedAt) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [nextAllowedAt]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending.current || Date.now() < nextAllowedAt) return;
    const normalized = email.trim().toLowerCase();
    if (
      !normalized ||
      normalized.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
    ) {
      setError('メールアドレスの形式をご確認ください。');
      return;
    }
    if (!captcha.token) {
      setError('認証を完了してください。');
      return;
    }
    pending.current = true;
    setSubmitting(true);
    setError('');
    setSubmitted(false);
    try {
      await passwordResetApi.request({
        email: normalized,
        captchaToken: captcha.token,
      });
      setSubmitted(true);
      const timestamp = Date.now();
      setNow(timestamp);
      setNextAllowedAt(timestamp + 60000);
    } catch (reason: unknown) {
      if (isAxiosError(reason) && reason.response?.status === 429) {
        setError('リクエストが多すぎます。時間をおいてお試しください。');
      } else if (isAxiosError(reason) && reason.response?.status === 400) {
        setError('入力内容と認証をご確認のうえ、もう一度お試しください。');
      } else {
        setError(
          'リクエストを送信できませんでした。通信状況を確認してお試しください。',
        );
      }
    } finally {
      pending.current = false;
      setSubmitting(false);
      captcha.reset();
    }
  };

  return {
    email,
    changeEmail: (value: string) => {
      setEmail(value);
      setError('');
    },
    error,
    submitted,
    submitting,
    secondsLeft,
    captcha,
    submit,
    submitDisabled: submitting || secondsLeft > 0 || !captcha.token,
  };
};
