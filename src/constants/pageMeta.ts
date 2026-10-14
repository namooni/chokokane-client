type pathsType = {
  LANDING: '/';
  LOGIN: '/login';
  SIGN_UP: '/signup';
  HOME: '/home';
  ADD: '/add';
  HISTORY: '/history';
  ANALYTICS: '/analytics';
  SETTING: '/setting';
};

export const paths: pathsType = {
  LANDING: '/',
  LOGIN: '/login',
  SIGN_UP: '/signup',
  HOME: '/home',
  ADD: '/add',
  HISTORY: '/history',
  ANALYTICS: '/analytics',
  SETTING: '/setting',
};

export const pageHeaderMeta: Record<
  string,
  { title: string; subtitle?: string }
> = {
  [paths.LOGIN]: {
    title: '로그인에도 들어가나',
  },
  [paths.SIGN_UP]: {
    title: '회원가입에도 들어가나',
  },
  [paths.HOME]: {
    title: 'ちょこかね✳',
  },
  [paths.ADD]: {
    title: '支出を記録',
    subtitle: '使ったお金をさっと記録しましょう。',
  },
  [paths.HISTORY]: {
    title: '支出履歴',
  },
  [paths.ANALYTICS]: {
    title: '支出をふりかえる',
  },
  [paths.SETTING]: {
    title: '設定',
  },
};
