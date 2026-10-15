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
import { useSignupForm } from '../hooks/auth/useSignupForm';

export const SignupPage = () => {
  const {
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
  } = useSignupForm();

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
