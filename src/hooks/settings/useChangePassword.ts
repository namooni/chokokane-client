import { useRef, useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../apis/user/userApi';
import { useAuth } from '../../auth/AuthContext';
import { paths } from '../../constants/pageMeta';

export const useChangePassword = (onClose: () => void, email?: string) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const pending = useRef(false);
  const { clearSession } = useAuth();
  const navigate = useNavigate();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending.current) return;
    if (!currentPassword.trim() || !newPassword.trim()) {
      setError('現在のパスワードと新しいパスワードを入力してください。');
      return;
    }
    const encoder = new TextEncoder();
    if (
      encoder.encode(currentPassword).length > 72 ||
      encoder.encode(newPassword).length > 72
    ) {
      setError('パスワードは72バイト以内で入力してください。');
      return;
    }
    if (newPassword !== confirmation) {
      setError('新しいパスワードと確認用パスワードが一致しません。');
      return;
    }
    pending.current = true;
    setSaving(true);
    setError('');
    try {
      await userApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmation('');
      clearSession({ reason: 'passwordChanged', email });
      navigate(paths.LOGIN, {
        replace: true,
        state: { passwordChanged: true, email },
      });
    } catch (reason: unknown) {
      if (isAxiosError(reason) && reason.response?.status === 400) {
        const message = reason.response.data?.message;
        setError(
          typeof message === 'string' && message
            ? message
            : '現在のパスワードと入力内容をご確認ください。',
        );
      } else {
        setError('パスワードを変更できませんでした。もう一度お試しください。');
      }
    } finally {
      pending.current = false;
      setSaving(false);
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmation,
    setConfirmation,
    error,
    saving,
    submit,
    close: () => {
      if (!pending.current) onClose();
    },
  };
};
