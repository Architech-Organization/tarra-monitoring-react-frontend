import { createTheme, ThemeOptions } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    chart: {
      blue: string;
      green: string;
      orange: string;
      red: string;
      purple: string;
      cyan: string;
      pink: string;
      yellow: string;
    };
  }

  interface PaletteOptions {
    gradient?: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    chart?: {
      blue: string;
      green: string;
      orange: string;
      red: string;
      purple: string;
      cyan: string;
      pink: string;
      yellow: string;
    };
  }

  interface Theme {
    custom: {
      sidebar: {
        width: number;
        collapsedWidth: number;
      };
      header: {
        height: number;
      };
      borderRadius: {
        small: number;
        medium: number;
        large: number;
      };
      shadows: {
        card: string;
        header: string;
        sidebar: string;
      };
    };
  }

  interface ThemeOptions {
    custom?: {
      sidebar?: {
        width: number;
        collapsedWidth: number;
      };
      header?: {
        height: number;
      };
      borderRadius?: {
        small: number;
        medium: number;
        large: number;
      };
      shadows?: {
        card: string;
        header: string;
        sidebar: string;
      };
    };
  }
}

const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Helvetica Neue", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
};

const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      tertiary: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    chart: {
      blue: '#1976d2',
      green: '#4caf50',
      orange: '#ff9800',
      red: '#f44336',
      purple: '#9c27b0',
      cyan: '#00bcd4',
      pink: '#e91e63',
      yellow: '#ffeb3b',
    },
  },
  custom: {
    sidebar: {
      width: 280,
      collapsedWidth: 64,
    },
    header: {
      height: 64,
    },
    borderRadius: {
      small: 4,
      medium: 8,
      large: 12,
    },
    shadows: {
      card: '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
      header: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      sidebar: '2px 0 8px 0 rgba(0, 0, 0, 0.05)',
    },
  },
});

// Default theme
export const theme = lightTheme;
export { lightTheme };
