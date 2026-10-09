export const palette = {
  green: {
    950: '#1B4039',
    900: '#176F65',
    800: '#157F73',
    700: '#276F5C',
    600: '#468D83',
    500: '#5BAF98',
    400: '#8DC8B5',
    300: '#B6DBCA',
    200: '#C5F0CE',
    150: '#CFE6DD',
    100: '#E9F6F0',
    50: '#F0F7F2',
  },

  neutral: {
    950: '#203A33',
    900: '#263B34',
    800: '#354F46',
    700: '#52665D',
    600: '#7A8985',
    500: '#91A29A',
    400: '#A4AAA7',
    300: '#D9E4DE',
    200: '#E6ECE7',
    100: '#F8FAF8',
    50: '#FFFFFF',
  },

  red: {
    800: '#C25B5B',
    100: '#FCECEC',
  },

  amber: {
    800: '#C78248',
    100: '#FFF1E6',
  },

  category: {
    food: '#E89A64',
    transport: '#5BAF98',
    daily: '#65A7D8',
    hobby: '#A88CD8',
    uncategorized: '#A4AAA7',
  },
} as const;

export const colors = {
  // Background
  page: palette.neutral[100],
  surface: palette.neutral[50],
  surfaceRaised: palette.neutral[50],
  surfaceSoft: palette.green[50],

  // Text
  text: palette.neutral[950],
  textSecondary: palette.neutral[700],
  textMuted: palette.neutral[600],
  textSubtle: palette.neutral[500],
  textSoft: palette.green[150],

  // Border
  border: palette.neutral[300],
  borderSubtle: palette.neutral[200],

  // Brand / Primary
  primary: palette.green[900],
  primaryHover: palette.green[800],
  primarySoft: palette.green[100],
  primaryBorder: palette.green[300],

  // Home budget card
  budgetCard: palette.green[900],
  budgetCardAccent: palette.green[600],
  budgetCardProgress: palette.green[200],
  budgetCardText: palette.neutral[50],

  // Status
  success: palette.green[800],
  successSoft: palette.green[100],

  danger: palette.red[800],
  dangerSoft: palette.red[100],

  warning: palette.amber[800],
  warningSoft: palette.amber[100],

  // Category
  categoryFood: palette.category.food,
  categoryTransport: palette.category.transport,
  categoryDaily: palette.category.daily,
  categoryHobby: palette.category.hobby,
  categoryUncategorized: palette.category.uncategorized,

  // Navigation
  navActive: palette.green[800],
  navActiveBackground: palette.green[100],
  navInactive: palette.neutral[500],

  // Misc
  inverse: palette.neutral[50],
  overlay: 'rgba(0, 0, 0, 0.4)',
} as const;
