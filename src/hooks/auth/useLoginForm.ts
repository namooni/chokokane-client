import { useState, type FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
export const useLoginForm = () => {
  const { login, isAuthenticated, loginNotice } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const signupComplete = location.state?.signupComplete === true;
  const successMessage =
    loginNotice?.reason === 'passwordChanged' ||
    location.state?.passwordChanged === true
      ? 'パスワードを変更しました。新しいパスワードでログインしてください。'
      : signupComplete
        ? 'アカウントを作成しました。ログインしてください。'
        : '';
  const initialEmail =
    loginNotice?.email ??
    (typeof location.state?.email === 'string' ? location.state.email : '');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const requestedPath = location.state?.from?.pathname;
  const returnTo =
    typeof requestedPath === 'string' &&
    requestedPath.startsWith('/') &&
    !requestedPath.startsWith('//')
      ? requestedPath
      : '/home';

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate(returnTo, { replace: true });
    } catch (reason: unknown) {
      if (!isAxiosError(reason)) {
        setError(
          'ログイン処理を完了できませんでした。別のブラウザーでもう一度お試しください。',
        );
      } else if (!reason.response) {
        setError(
          'サーバーに接続できませんでした。通信環境を確認して、もう一度お試しください。',
        );
      } else if (reason.response.status === 401) {
        setError(
          'ログインできませんでした。メールアドレスとパスワードをご確認ください。',
        );
      } else if (reason.response.status === 403) {
        setError(
          'ログインのリクエストが拒否されました。サイトのURLを確認してください。',
        );
      } else if (reason.response.status >= 500) {
        setError(
          'サーバーでエラーが発生しました。時間をおいて、もう一度お試しください。',
        );
      } else {
        setError(
          'ログインできませんでした。入力内容を確認して、もう一度お試しください。',
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    submitting,
    successMessage,
    isAuthenticated,
    submit,
  };
};
