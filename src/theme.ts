import { createMuiTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    sidebarWidth: number;
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    sidebarWidth?: number;
  }
}

export default createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#cc2b33',
    },
  },
  sidebarWidth: 260,
});
