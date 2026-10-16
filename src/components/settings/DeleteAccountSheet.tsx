import styled from 'styled-components';
import { useDeleteAccount } from '../../hooks/settings/useDeleteAccount';
import { BottomSheet } from '../ui/BottomSheet';
import { FormInput, PrimaryButton, TextAction } from '../ui/FormControls';
import { colors } from '../../theme/palette';

export const DeleteAccountSheet = ({ onClose }: { onClose: () => void }) => {
  const form = useDeleteAccount(onClose);
  return (
    <BottomSheet title="退会" onClose={form.close}>
      <Title>退会しますか？</Title>
      <Warning>
        アカウントとすべての支出・カテゴリー・予算が完全に削除されます。
        削除したデータは復元できません。
      </Warning>
      <Form onSubmit={form.submit}>
        <label htmlFor="delete-account-password">
          本人確認のため、パスワードを入力してください。
        </label>
        <FormInput
          id="delete-account-password"
          type="password"
          autoComplete="current-password"
          required
          disabled={form.deleting}
          value={form.password}
          onChange={(event) => form.changePassword(event.target.value)}
          aria-invalid={!!form.error}
          aria-describedby={form.error ? 'delete-account-error' : undefined}
        />
        {form.error && (
          <Error id="delete-account-error" role="alert">
            {form.error}
          </Error>
        )}
        <DeleteButton
          type="submit"
          disabled={form.deleting}
          aria-busy={form.deleting}
        >
          {form.deleting ? '退会処理中...' : 'すべてのデータを削除して退会'}
        </DeleteButton>
      </Form>
      <TextAction type="button" onClick={form.close} disabled={form.deleting}>
        キャンセル
      </TextAction>
    </BottomSheet>
  );
};

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
`;
const Warning = styled.p`
  margin: 0;
  padding: 16px;
  border-radius: 14px;
  background: ${colors.dangerSoft};
  color: ${colors.danger};
  font-size: 13px;
  line-height: 1.8;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  label {
    font-size: 13px;
    line-height: 1.7;
    color: ${colors.textSecondary};
  }
`;
const DeleteButton = styled(PrimaryButton)`
  background: ${colors.danger};
`;
const Error = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: ${colors.danger};
`;
