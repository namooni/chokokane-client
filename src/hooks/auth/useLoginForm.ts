import { useState, type FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
export const useLoginForm = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const signupComplete = location.state?.signupComplete === true;
  const initialEmail =
    typeof location.state?.email === 'string' ? location.state.email : '';
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
      await login({ email, password });
      navigate(returnTo, { replace: true });
    } catch {
      setError(
        'ログインできませんでした。メールアドレスとパスワードをご確認ください。',
      );
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
    signupComplete,
    isAuthenticated,
    submit,
  };
};
