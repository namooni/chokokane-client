import { useForgotPassword } from '../hooks/auth/useForgotPassword';
import { TextAction as RetryButton } from '../components/ui/FormControls';
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
  Success,
  SubmitButton,
  Note,
  ActionLink,
  Footer,
} from './authStyles';

export const ForgotPasswordPage = () => {
  const form = useForgotPassword();
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
          <Eyebrow>ACCOUNT RECOVERY</Eyebrow>
          <h1>
            パスワードを
            <br />
            お忘れですか？
          </h1>
          <p>
            登録したメールアドレスに、パスワード再設定のリンクをご案内します。
          </p>
        </Intro>
        <Form onSubmit={form.submit}>
          {form.submitted && (
            <Success role="status">
              登録済みのメールアドレスの場合、パスワード再設定の案内を送信します。
              メールが届かない場合は、迷惑メールフォルダーもご確認ください。
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
              required
              maxLength={255}
              disabled={form.submitting}
              value={form.email}
              onChange={(event) => form.changeEmail(event.target.value)}
            />
          </Field>
          <div aria-label="本人確認">
            <div ref={form.captcha.setContainer} />
            {form.captcha.loading && (
              <Note role="status">認証を読み込み中...</Note>
            )}
            {form.captcha.error && (
              <>
                <Error role="alert">{form.captcha.error}</Error>
                {form.captcha.configured && (
                  <RetryButton type="button" onClick={form.captcha.retry}>
                    認証を再読み込み
                  </RetryButton>
                )}
              </>
            )}
          </div>
          {form.error && <Error role="alert">{form.error}</Error>}
          <SubmitButton
            type="submit"
            disabled={form.submitDisabled}
            aria-busy={form.submitting}
          >
            {form.submitting
              ? 'リクエスト中...'
              : form.secondsLeft > 0
                ? `再リクエストまで ${form.secondsLeft}秒`
                : '再設定リンクをリクエスト'}
          </SubmitButton>
          <Note>
            リンクの有効期限は発行から30分です。
            <br />
            再リクエストは60秒後から行えます。
          </Note>
          <Note>
            <ActionLink to="/login">ログインへ戻る</ActionLink>
          </Note>
        </Form>
      </Region>
      <Footer>ちょこかね · あなたの毎日に寄り添う家計簿</Footer>
    </Page>
  );
};
