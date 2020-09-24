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

const defaultTheme = createMuiTheme();

export default createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        borderRadius: '4px',
        textTransform: 'none',
        color: 'rgb(40, 42, 43)',
        fontSize: '0.9rem',
        transition: defaultTheme.transitions.create(['background-color', 'box-shadow', 'border', 'color'], {
          duration: defaultTheme.transitions.duration.short,
        }),
      },
      text: {
        padding: '6px 14px',
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
      outlinedPrimary: {
        border: '2px solid #027AC5',
        '&:hover': {
          border: '2px solid rgb(1, 85, 137)',
        },
      },
      startIcon: {
        marginRight: '6px',
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
    MuiDialogActions: {
      root: {
        padding: '16px',
      },
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  palette: {
    primary: {
      main: '#027AC5',
    },
  },
  brand: '#E22525',
  footerHeight: 72,
  sidebarWidth: 355,
  sidebarMobileHeight: 90,
});
