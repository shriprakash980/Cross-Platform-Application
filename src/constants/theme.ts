/**
 * Design System tokens for HB+ Aegis
 * Aesthetics: Dark, glassmorphism, depth, deep navy background with electric violet & cyan accents.
 */

export const THEME = {
  colors: {
    background: '#0A0E1A',
    backgroundAlt: '#0E1424',
    surface: 'rgba(18, 24, 38, 0.7)',
    surfaceElevated: 'rgba(26, 34, 54, 0.8)',
    surfaceHover: 'rgba(34, 46, 74, 0.85)',
    surfaceActive: 'rgba(40, 56, 90, 0.9)',

    borderSubtle: 'rgba(255, 255, 255, 0.08)',
    borderMedium: 'rgba(255, 255, 255, 0.16)',
    borderFocus: 'rgba(124, 92, 255, 0.6)',

    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',

    // Accents
    violet: '#7C5CFF',
    violetHover: '#6A46FF',
    violetLight: 'rgba(124, 92, 255, 0.15)',
    cyan: '#22D3EE',
    cyanHover: '#06B6D4',
    cyanLight: 'rgba(34, 211, 238, 0.15)',

    // Role Badges
    adminRole: '#7C5CFF',
    adminBadgeBg: 'rgba(124, 92, 255, 0.16)',
    adminBadgeBorder: 'rgba(124, 92, 255, 0.35)',

    userRole: '#22D3EE',
    userBadgeBg: 'rgba(34, 211, 238, 0.16)',
    userBadgeBorder: 'rgba(34, 211, 238, 0.35)',

    // Status
    success: '#10B981',
    successBg: 'rgba(16, 185, 129, 0.15)',
    successBorder: 'rgba(16, 185, 129, 0.3)',

    danger: '#EF4444',
    dangerBg: 'rgba(239, 68, 68, 0.15)',
    dangerBorder: 'rgba(239, 68, 68, 0.3)',

    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.15)',
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    pill: 9999,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  glass: {
    backgroundColor: 'rgba(18, 24, 38, 0.72)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    backdropFilter: 'blur(16px)',
  },

  shadows: {
    glowViolet: '0 0 24px rgba(124, 92, 255, 0.35)',
    glowCyan: '0 0 24px rgba(34, 211, 238, 0.3)',
    card: '0 12px 32px rgba(0, 0, 0, 0.45)',
    cardHover: '0 20px 40px rgba(0, 0, 0, 0.65)',
  },
};
