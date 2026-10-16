import { useRef, useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../apis/user/userApi';
import { useAuth } from '../../auth/AuthContext';
import { paths } from '../../constants/pageMeta';

export const useDeleteAccount = (onClose: () => void) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const pending = useRef(false);
  const { clearSession } = useAuth();
  const navigate = useNavigate();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending.current) return;
    if (!password.trim()) {
      setError('パスワードを入力してください。');
      return;
    }
    if (new TextEncoder().encode(password).length > 72) {
      setError('パスワードが正しくありません。');
      return;
    }
    pending.current = true;
    setDeleting(true);
    setError('');
    try {
      await userApi.deleteAccount({ password });
      setPassword('');
      clearSession({ reason: 'accountDeleted' });
      navigate(paths.LOGIN, { replace: true });
    } catch (reason: unknown) {
      if (isAxiosError(reason) && reason.response?.status === 400) {
        setError('パスワードをご確認ください。');
      } else {
        setError(
          '退会処理を完了できませんでした。通信状況を確認し、もう一度お試しください。',
        );
      }
    } finally {
      pending.current = false;
      setDeleting(false);
    }
  };

  return {
    password,
    changePassword: (value: string) => {
      if (pending.current) return;
      setPassword(value);
      setError('');
    },
    error,
    deleting,
    submit,
    close: () => {
      if (!pending.current) onClose();
    },
  };
};
