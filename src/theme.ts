import { createMuiTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    sidebarWidth: string;
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    sidebarWidth?: string;
  }
}

export default createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#cc2b33',
    },
  },
  sidebarWidth: '250px',
});
