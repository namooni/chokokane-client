import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Page,
  Topbar,
  Brand,
  BrandMark,
  BackLink,
  Region as SignupRegion,
  Intro as SignupIntro,
  Eyebrow,
  Form as SignupForm,
  Field,
  Input,
  Error,
  SubmitButton,
  Note as LoginPrompt,
  ActionLink as LoginLink,
  Footer,
} from './authStyles';
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
          <span>ちょこかね</span>
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
      <Footer>ちょこかね · あなたの毎日に寄り添う家計簿</Footer>
    </Page>
  );
};
