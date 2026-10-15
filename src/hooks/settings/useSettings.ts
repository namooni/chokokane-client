import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { paths } from '../../constants/pageMeta';

export const useSettings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const pending = useRef(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    if (pending.current) return;
    pending.current = true;
    setLoggingOut(true);
    setError('');
    try {
      await logout();
      navigate(paths.LOGIN, { replace: true });
    } catch {
      setError('ログアウトできませんでした。もう一度お試しください。');
    } finally {
      pending.current = false;
      setLoggingOut(false);
    }
  };

  return { loggingOut, error, handleLogout };
};
