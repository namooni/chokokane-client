import { Navigate } from 'react-router-dom';
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
import { useLoginForm } from '../hooks/auth/useLoginForm';

export const LoginPage = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    submitting,
    successMessage,
    isAuthenticated,
    submit,
  } = useLoginForm();
  if (isAuthenticated) return <Navigate to="/home" replace />;

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
          {successMessage && (
            <Success role="status">
              {successMessage}
            </Success>
          )}
          <Field>
            メールアドレス
            <Input
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
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
