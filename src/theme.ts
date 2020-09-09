import { createMuiTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    sidebarWidth: number;
    sidebarMobileHeight: number;
    brand: string;
    footerHeight: number;
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    sidebarWidth?: number;
    sidebarMobileHeight?: number;
    brand: string;
    footerHeight: number;
  }
}

export default createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        borderRadius: '4px',
        textTransform: 'none',
        color: 'rgb(40, 42, 43)',
        fontSize: '0.9rem',
      },
      text: {
        padding: '6px 14px',
      },
    },
    MuiTypography: {
      body1: {
        color: 'rgb(40, 42, 43)',
        fontSize: '0.9rem',
      },
    },
    MuiInputBase: {
      root: {
        fontSize: '0.9rem',
      },
    },
    MuiSelect: {
      root: {
        padding: '0.85em',
      },
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  brand: '#E22525',
  footerHeight: 64,
  sidebarWidth: 355,
  sidebarMobileHeight: 90,
});
