import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../apis/apiClient';

export const SignupPage = () => {
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

  return (
    <Page>
      <Topbar>
        <Brand to="/">
          <BrandMark>¥</BrandMark>
          <span>Moneylog</span>
        </Brand>
        <BackLink to="/">トップへ戻る</BackLink>
      </Topbar>
      <SignupRegion>
        <SignupIntro>
          <Eyebrow>START YOUR LEDGER</Eyebrow>
          <h1>
            お金の記録を、
            <br />
            今日から。
          </h1>
          <p>アカウントを作成して、自分だけの家計簿をはじめましょう。</p>
        </SignupIntro>
        <SignupForm onSubmit={submit}>
          <Field>
            お名前
            <Input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </Field>
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
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </Field>
          <Field>
            パスワード（確認）
            <Input
              type="password"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              required
            />
          </Field>
          {error && <Error role="alert">{error}</Error>}
          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? '登録中...' : 'アカウントを作成'}
          </SubmitButton>
          <LoginPrompt>
            すでにアカウントをお持ちですか？{' '}
            <LoginLink to="/login">ログイン</LoginLink>
          </LoginPrompt>
        </SignupForm>
      </SignupRegion>
      <Footer>Moneylog · あなたの毎日に寄り添う家計簿</Footer>
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
const SignupRegion = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 0.7fr);
  gap: 90px;
  align-items: center;
  max-width: 1000px;
  min-height: min(740px, calc(100vh - 150px));
  margin: 0 auto;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 24px;
    align-content: center;
    padding: 42px 0;
  }
`;
const SignupIntro = styled.div`
  h1 {
    margin: 12px 0;
    color: #17211b;
    font-size: 42px;
    line-height: 1.25;
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
const SignupForm = styled.form`
  display: grid;
  gap: 15px;
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
const LoginPrompt = styled.p`
  margin: 0;
  color: #788079;
  font-size: 12px;
  text-align: center;
`;
const LoginLink = styled(Link)`
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
