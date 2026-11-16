/**
 * WARM_EARTHY preset, overridden with the Library Shelf Sort brief palette.
 * The preset `name` must stay exactly as the preset defines it.
 */
export const theme = {
  name: 'warm-earthy',

  colors: {
    bg: {
      primary: '#F2F6ED',
      secondary: '#F2EAD8',
      tertiary: '#E8DDC4',
      accent: '#D8C9A8',
    },
    earth: {
      sage: '#B3DDB0',
      olive: '#71AB2A',
      terracotta: '#D97B4D',
      mustard: '#D9B36C',
      walnut: '#8A6245',
      cream: '#FAF5EC',
    },
    wood: {
      dark: '#8A6245',
      light: '#B88B61',
    },
    action: {
      primary: '#2891E0',
      highlight: '#67B3EA',
    },
    family: {
      A: '#71AB2A',
      B: '#2891E0',
      C: '#D97B4D',
      D: '#7A648F',
    },
    text: {
      primary: '#1F2418',
      secondary: '#4D5940',
      muted: '#606A56',
      onDark: '#F2F6ED',
      onWood: '#F2EAD8',
    },
    ui: {
      surface: '#FAF5EC',
      surfaceWarm: '#F2EAD8',
      inset: '#E8DDC4',
      border: '#D8C9A8',
      divider: '#E8DDC4',
      overlay: 'rgba(31, 36, 24, 0.55)',
      glass: 'rgba(250, 245, 236, 0.92)',
    },
  },

  gradients: {
    primary: ['#2891E0', '#67B3EA'],
    sage: ['#71AB2A', '#B3DDB0'],
    wood: ['#B88B61', '#8A6245'],
    paper: ['#FAF5EC', '#F2EAD8'],
    warn: ['#D97B4D', '#D9B36C'],
  },

  typography: {
    hero: { fontSize: 40, fontWeight: '700' as const, lineHeight: 44, letterSpacing: -0.5 },
    heading: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34, letterSpacing: -0.2 },
    title: { fontSize: 24, fontWeight: '700' as const, lineHeight: 30 },
    fact: { fontSize: 18, fontWeight: '400' as const, lineHeight: 26 },
    body: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
    button: { fontSize: 16, fontWeight: '700' as const, lineHeight: 24, letterSpacing: 0.6 },
    number: { fontSize: 24, fontWeight: '700' as const, lineHeight: 30 },
    helper: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16, letterSpacing: 0.4 },
  },

  radius: { xs: 8, sm: 12, md: 16, lg: 18, xl: 24, full: 999 },

  spacing: { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32 },

  shadows: {
    card: {
      shadowColor: '#8A6245',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    sheet: {
      shadowColor: '#8A6245',
      shadowOpacity: 0.18,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: -3 },
      elevation: 8,
    },
    primary: {
      shadowColor: '#2891E0',
      shadowOpacity: 0.18,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },
    book: {
      shadowColor: '#1F2418',
      shadowOpacity: 0.16,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },
  },
};

export type Theme = typeof theme;
