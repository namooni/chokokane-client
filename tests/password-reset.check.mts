import assert from 'node:assert/strict';
import {
  isPublicAuthRequest,
  readPasswordResetToken,
  validateNewPassword,
} from '../src/util/auth.ts';

const token = 'a'.repeat(43);
assert.equal(readPasswordResetToken(`#token=${token}`), token);
for (const hash of [
  '',
  '#token=',
  `#token=${token}&token=${token}`,
  `#token=${'a'.repeat(42)}`,
  `#token=${'a'.repeat(44)}`,
  '#token=%25broken',
  `#token=${'a'.repeat(42)}+`,
]) {
  assert.equal(readPasswordResetToken(hash), null);
}
assert.equal(validateNewPassword('a'.repeat(72), 'a'.repeat(72)), '');
assert.notEqual(validateNewPassword('a'.repeat(73), 'a'.repeat(73)), '');
assert.equal(validateNewPassword('あ'.repeat(24), 'あ'.repeat(24)), '');
assert.notEqual(validateNewPassword('あ'.repeat(25), 'あ'.repeat(25)), '');
assert.equal(validateNewPassword('🙂'.repeat(18), '🙂'.repeat(18)), '');
assert.notEqual(validateNewPassword('🙂'.repeat(19), '🙂'.repeat(19)), '');
assert.notEqual(validateNewPassword('　 ', '　 '), '');
assert.equal(validateNewPassword(' password ', ' password '), '');
assert.notEqual(validateNewPassword(' password ', 'password'), '');
for (const path of [
  '/login',
  '/signup',
  '/refresh',
  '/password-reset/request',
  '/password-reset/confirm',
  '/api/password-reset/confirm?x=y',
  'https://api.chokokane.site/password-reset/request/',
]) {
  assert.equal(isPublicAuthRequest(path), true, path);
}
for (const path of [
  '/me/password',
  '/me',
  '/history',
  '/password-reset/request/extra',
  '/password-reset/confirmations',
]) {
  assert.equal(isPublicAuthRequest(path), false, path);
}
console.log(
  'Password reset token, UTF-8 validation and public auth request checks passed.',
);
