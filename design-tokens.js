/**
 * GoTalent Design System
 * Unified design tokens extracted from the landing page
 */

export const colors = {
  // Primary colors
  background: '#1c1c1c',
  backgroundDark: '#0f0f0f',
  primary: '#daa520',       // Goldenrod
  primaryLight: '#eeb534',
  primaryDark: '#b8860b',
  
  // Text colors
  text: '#f3e5ab',          // Wheat/Cream
  textSecondary: '#d4c59a',
  textMuted: '#a89968',
  
  // Brown variants (for accents and backgrounds)
  brown1: '#8b7355',
  brown2: '#9b8365',
  brown3: '#ab9375',
  brown4: '#7b6345',
  brown5: '#6b5335',
  brownDark: '#2c1810',
  
  // Semantic colors
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
  
  // UI colors
  border: 'rgba(218, 165, 32, 0.2)',
  borderLight: 'rgba(218, 165, 32, 0.1)',
  overlay: 'rgba(44, 24, 16, 0.15)',
  overlayDark: 'rgba(44, 24, 16, 0.9)',
};

export const typography = {
  // Font families
  fontFamily: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    monospace: '"JetBrains Mono", "Fira Code", "Monaco", "Cascadia Code", "SF Mono", monospace',
  },
  
  // Font weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  // Font sizes
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
    mining: '1.5px',    // For mining-themed headings
    idCard: '0.8px',    // For ID card style text
  },
};

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
  
  // Custom shadows for the theme
  text: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  gold: '0 4px 15px rgba(218, 165, 32, 0.3)',
  goldHover: '0 8px 25px rgba(218, 165, 32, 0.4)',
};

export const gradients = {
  primary: 'linear-gradient(135deg, rgba(218, 165, 32, 0.9) 0%, rgba(218, 165, 32, 1) 100%)',
  primaryHover: 'linear-gradient(135deg, rgba(218, 165, 32, 1) 0%, rgba(238, 185, 52, 1) 100%)',
  overlay: 'linear-gradient(135deg, rgba(44, 24, 16, 0.1) 0%, rgba(44, 24, 16, 0.15) 100%)',
  dark: 'linear-gradient(180deg, rgba(28, 28, 28, 0) 0%, rgba(28, 28, 28, 1) 100%)',
};

export const transitions = {
  fast: '150ms',
  base: '300ms',
  slow: '500ms',
  easing: 'ease',
  easingInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easingOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  easingIn: 'cubic-bezier(0.4, 0, 1, 1)',
};

// CSS Custom Properties (CSS Variables)
export const cssVariables = `
:root {
  /* Colors */
  --color-background: ${colors.background};
  --color-background-dark: ${colors.backgroundDark};
  --color-primary: ${colors.primary};
  --color-primary-light: ${colors.primaryLight};
  --color-primary-dark: ${colors.primaryDark};
  --color-text: ${colors.text};
  --color-text-secondary: ${colors.textSecondary};
  --color-text-muted: ${colors.textMuted};
  --color-brown-dark: ${colors.brownDark};
  --color-border: ${colors.border};
  --color-overlay: ${colors.overlay};
  
  /* Typography */
  --font-primary: ${typography.fontFamily.primary};
  --font-monospace: ${typography.fontFamily.monospace};
  
  /* Spacing */
  --spacing-base: ${spacing[4]};
  
  /* Transitions */
  --transition-base: ${transitions.base};
}
`;

// Utility function to generate CSS from design tokens
export function generateCSS() {
  return cssVariables;
}

// Export all tokens as default
export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  gradients,
  transitions,
  cssVariables,
  generateCSS,
};
