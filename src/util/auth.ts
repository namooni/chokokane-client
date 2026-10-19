export const isPublicAuthRequest = (url = '') => {
  const pathname = url.split(/[?#]/, 1)[0].replace(/\/+$/, '');
  return /\/(login|signup|refresh|password-reset\/(request|confirm))$/.test(
    pathname,
  );
};

export const readPasswordResetToken = (hash: string) => {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const tokens = params.getAll('token');
  return tokens.length === 1 && /^[A-Za-z0-9_-]{43}$/.test(tokens[0])
    ? tokens[0]
    : null;
};

export const validateNewPassword = (password: string, confirmation: string) => {
  if (!password.trim()) return '新しいパスワードを入力してください。';
  if (new TextEncoder().encode(password).length > 72)
    return '新しいパスワードはUTF-8で72バイト以内にしてください。';
  if (password !== confirmation)
    return '新しいパスワードと確認用パスワードが一致しません。';
  return '';
};
