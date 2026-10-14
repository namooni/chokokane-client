import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Page,
  Topbar,
  Brand,
  BrandMark,
  BackLink,
  Region as LoginRegion,
  Intro as LoginIntro,
  Eyebrow,
  Form as LoginForm,
  Field,
  Input,
  Error,
  Success,
  SubmitButton,
  Note as PrivacyNote,
  Note as SignupPrompt,
  ActionLink as SignupLink,
  Footer,
} from './authStyles';
import { useAuth } from '../auth/AuthContext';

export const LoginPage = () => {
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

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

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

  return (
    <Page>
      <Topbar>
        <Brand to="/">
          <BrandMark>¥</BrandMark>
          <span>ちょこかね</span>
        </Brand>
        <BackLink to="/">トップへ戻る</BackLink>
      </Topbar>
      <LoginRegion>
        <LoginIntro>
          <Eyebrow>YOUR PRIVATE LEDGER</Eyebrow>
          <h1>おかえりなさい。</h1>
          <p>ログインして、あなたの家計簿を続けましょう。</p>
        </LoginIntro>
        <LoginForm onSubmit={submit}>
          {signupComplete && (
            <Success role="status">
              アカウントを作成しました。ログインしてください。
            </Success>
          )}
          <Field>
            メールアドレス
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Field>
          <Field>
            パスワード
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </Field>
          {error && <Error role="alert">{error}</Error>}
          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? 'ログイン中...' : 'ログイン'}
          </SubmitButton>
          <PrivacyNote>
            家計簿の内容はログイン後にのみ表示されます。
          </PrivacyNote>
          <SignupPrompt>
            アカウントをお持ちでない方は{' '}
            <SignupLink to="/signup">新規登録</SignupLink>
          </SignupPrompt>
        </LoginForm>
      </LoginRegion>
      <Footer>ちょこかね · あなたの毎日に寄り添う家計簿</Footer>
    </Page>
  );
};
