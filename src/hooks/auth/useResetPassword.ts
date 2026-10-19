import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAuth } from '../../auth/AuthContext';
import { passwordResetApi } from '../../apis/auth/passwordResetApi';
import { readPasswordResetToken, validateNewPassword } from '../../util/auth';

export const useResetPassword = () => {
  const [token, setToken] = useState(() =>
    readPasswordResetToken(window.location.hash),
  );
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [rejected, setRejected] = useState(false);
  const pending = useRef(false);
  const { clearSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Keep the secret in component memory, out of copied URLs and browser history.
    window.history.replaceState(
      window.history.state,
      '',
      window.location.pathname + window.location.search,
    );
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending.current || !token || rejected) return;
    const validationError = validateNewPassword(password, confirmation);
    if (validationError) {
      setError(validationError);
      return;
    }
    pending.current = true;
    setSubmitting(true);
    setError('');
    try {
      await passwordResetApi.confirm({ token, newPassword: password });
      setToken(null);
      setPassword('');
      setConfirmation('');
      clearSession({ reason: 'passwordChanged' });
      navigate('/login', { replace: true, state: { passwordChanged: true } });
    } catch (reason: unknown) {
      if (isAxiosError(reason) && reason.response?.status === 400) {
        setRejected(true);
        setToken(null);
        setPassword('');
        setConfirmation('');
        setError(
          '再設定リンクが無効か、有効期限が切れています。もう一度お申し込みください。',
        );
      } else if (isAxiosError(reason) && reason.response?.status === 429) {
        setError('リクエストが多すぎます。時間をおいてお試しください。');
      } else {
        setError(
          'パスワードを変更できませんでした。通信状況を確認してお試しください。',
        );
      }
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  };

  return {
    password,
    confirmation,
    error,
    submitting,
    submit,
    validLink: !!token && !rejected,
    changePassword: (value: string) => {
      setPassword(value);
      setError('');
    },
    changeConfirmation: (value: string) => {
      setConfirmation(value);
      setError('');
    },
  };
};
