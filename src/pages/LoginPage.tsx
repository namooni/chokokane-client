import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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

const Page = styled.main`
  min-height: 100vh;
  padding: 0 28px;
  background: #f3f1e9;
`;
const Topbar = styled.header`
  max-width: 1180px;
  height: 82px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d8d5ca;
`;
const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #17211b;
  font-size: 19px;
  font-weight: 700;
  text-decoration: none;
`;
const BrandMark = styled.span`
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  background: #163c2c;
  color: #f8f4e8;
`;
const BackLink = styled(Link)`
  color: #52675a;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
`;
const LoginRegion = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 0.7fr);
  gap: 90px;
  align-items: center;
  max-width: 1000px;
  min-height: min(690px, calc(100vh - 150px));
  margin: 0 auto;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 30px;
    align-content: center;
    padding: 56px 0;
  }
`;
const LoginIntro = styled.div`
  h1 {
    margin: 12px 0;
    color: #17211b;
    font-size: 42px;
    line-height: 1.2;
  }

  p {
    max-width: 400px;
    color: #69736d;
    line-height: 1.8;
  }
`;
const Eyebrow = styled.p`
  color: #69736d;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
`;
const LoginForm = styled.form`
  display: grid;
  gap: 18px;
  padding: 28px;
  border: 1px solid #dfddd4;
  border-radius: 16px;
  background: #fbfaf6;
`;
const Field = styled.label`
  display: grid;
  gap: 8px;
  color: #37423b;
  font-size: 13px;
  font-weight: 600;
`;
const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #d8d6cd;
  border-radius: 9px;
  background: #fff;
  outline: none;

  &:focus {
    border-color: #557764;
    box-shadow: 0 0 0 3px #5577641c;
  }
`;
const Error = styled.p`
  margin: 0;
  color: #8c3c30;
  font-size: 13px;
`;
const Success = styled.p`
  margin: 0;
  color: #28533f;
  font-size: 13px;
  line-height: 1.6;
`;
const SubmitButton = styled.button`
  height: 46px;
  border: 0;
  border-radius: 9px;
  background: #163c2c;
  color: #fff;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
`;
const PrivacyNote = styled.p`
  margin: 0;
  color: #788079;
  font-size: 12px;
  text-align: center;
`;
const SignupPrompt = styled.p`
  margin: 0;
  color: #788079;
  font-size: 12px;
  text-align: center;
`;
const SignupLink = styled(Link)`
  color: #28533f;
  font-weight: 700;
  text-decoration: none;
`;
const Footer = styled.footer`
  max-width: 1180px;
  margin: 0 auto;
  padding: 22px 0 30px;
  border-top: 1px solid #d8d5ca;
  color: #8a908b;
  font-size: 12px;
`;
