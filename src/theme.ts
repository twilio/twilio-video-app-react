import { createMuiTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    sidebarPosition: string;
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    sidebarPosition?: string;
  }
}

export default createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#F22F46',
    },
  },
  sidebarPosition: '15%',
});
