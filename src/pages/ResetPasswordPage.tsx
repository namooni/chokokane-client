import { useResetPassword } from '../hooks/auth/useResetPassword';
import {
  Page,
  Topbar,
  Brand,
  BrandMark,
  BackLink,
  Region,
  Intro,
  Eyebrow,
  Form,
  Field,
  Input,
  Error,
  SubmitButton,
  Note,
  ActionLink,
  Footer,
} from './authStyles';

export const ResetPasswordPage = () => {
  const form = useResetPassword();
  return (
    <Page>
      <Topbar>
        <Brand to="/">
          <BrandMark>¥</BrandMark>
          <span>ちょこかね</span>
        </Brand>
        <BackLink to="/login">ログインへ戻る</BackLink>
      </Topbar>
      <Region>
        <Intro>
          <Eyebrow>RESET PASSWORD</Eyebrow>
          <h1>
            新しいパスワードを
            <br />
            設定しましょう。
          </h1>
          <p>設定後は、新しいパスワードでログインしてください。</p>
        </Intro>
        {form.validLink ? (
          <Form onSubmit={form.submit}>
            <Field>
              新しいパスワード
              <Input
                type="password"
                autoComplete="new-password"
                required
                disabled={form.submitting}
                value={form.password}
                onChange={(event) => form.changePassword(event.target.value)}
              />
            </Field>
            <Field>
              新しいパスワード（確認）
              <Input
                type="password"
                autoComplete="new-password"
                required
                disabled={form.submitting}
                value={form.confirmation}
                onChange={(event) =>
                  form.changeConfirmation(event.target.value)
                }
              />
            </Field>
            <Note>
              72バイト以内で入力してください。
              <br />
              日本語などは1文字が複数バイトになります。
            </Note>
            {form.error && <Error role="alert">{form.error}</Error>}
            <SubmitButton
              type="submit"
              disabled={form.submitting}
              aria-busy={form.submitting}
            >
              {form.submitting ? '設定中...' : 'パスワードを設定'}
            </SubmitButton>
          </Form>
        ) : (
          <Error role="alert">
            {form.error ||
              '再設定リンクが見つからないか、無効です。メールのリンクを開き直すか、もう一度お申し込みください。'}
          </Error>
        )}
        <Note>
          <ActionLink to="/forgot-password">
            再設定リンクを再リクエスト
          </ActionLink>
        </Note>
      </Region>
      <Footer>ちょこかね · あなたの毎日に寄り添う家計簿</Footer>
    </Page>
  );
};
