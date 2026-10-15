import { useState, type FormEvent } from 'react';
import { api } from '../../apis/apiClient';
import { useNavigate } from 'react-router-dom';
export const useSignupForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('パスワードが一致しません。');
      return;
    }

    setSubmitting(true);
    try {
      await api('/signup', {
        method: 'POST',
        data: { name, email, password },
      });
      navigate('/login', {
        replace: true,
        state: { signupComplete: true, email },
      });
    } catch {
      setError('登録できませんでした。入力内容をご確認ください。');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    error,
    submitting,
    submit,
  };
};
