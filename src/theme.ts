import { createMuiTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    sidebarWidth: number;
    sidebarMobileHeight: number;
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    sidebarWidth?: number;
    sidebarMobileHeight?: number;
  }
}

export default createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "1em",
      }
    }
  },
  typography: {
    fontFamily: [
      'Lato',
      'Muli'
    ].join(','),
    htmlFontSize: 12,
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#0099da',
    },
  },
  sidebarWidth: 260,
  sidebarMobileHeight: 90,
});
