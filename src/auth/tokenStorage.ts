const ACCESS_TOKEN_KEY = 'moneylog.accessToken';
const REFRESH_TOKEN_KEY = 'moneylog.refreshToken';

export const getAccessToken = () => sessionStorage.getItem(ACCESS_TOKEN_KEY);

export const saveAccessToken = (accessToken: string) => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const clearTokens = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  // Remove tokens saved by the previous client-side refresh-token flow.
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};
