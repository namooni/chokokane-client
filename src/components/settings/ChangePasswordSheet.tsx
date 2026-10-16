import styled from 'styled-components';
import { useChangePassword } from '../../hooks/settings/useChangePassword';
import { BottomSheet } from '../ui/BottomSheet';
import { FormInput, PrimaryButton, TextAction } from '../ui/FormControls';
import { colors } from '../../theme/palette';

export const ChangePasswordSheet = ({
  onClose,
  email,
}: {
  onClose: () => void;
  email?: string;
}) => {
  const form = useChangePassword(onClose, email);
  return (
    <BottomSheet title="パスワード変更" onClose={form.close}>
      <Title>パスワード変更</Title>
      <Note>変更後は、新しいパスワードで再ログインしてください。</Note>
      <Form onSubmit={form.submit}>
        <label htmlFor="current-password">現在のパスワード</label>
        <FormInput
          id="current-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          disabled={form.saving}
          value={form.currentPassword}
          onChange={(event) => form.setCurrentPassword(event.target.value)}
        />
        <label htmlFor="new-password">新しいパスワード</label>
        <FormInput
          id="new-password"
          type="password"
          autoComplete="new-password"
          required
          disabled={form.saving}
          value={form.newPassword}
          onChange={(event) => form.setNewPassword(event.target.value)}
        />
        <label htmlFor="confirm-password">新しいパスワード（確認）</label>
        <FormInput
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          required
          disabled={form.saving}
          value={form.confirmation}
          onChange={(event) => form.setConfirmation(event.target.value)}
        />
        <Note>
          72バイト以内で入力してください。日本語などは1文字が複数バイトになります。
        </Note>
        {form.error && <Error role="alert">{form.error}</Error>}
        <PrimaryButton
          type="submit"
          disabled={form.saving}
          aria-busy={form.saving}
        >
          {form.saving ? '変更中...' : 'パスワードを変更'}
        </PrimaryButton>
      </Form>
      <TextAction type="button" onClick={form.close} disabled={form.saving}>
        キャンセル
      </TextAction>
    </BottomSheet>
  );
};

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
`;
const Note = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: ${colors.textMuted};
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  label {
    font-size: 13px;
    color: ${colors.textSecondary};
  }
`;
const Error = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${colors.danger};
`;
