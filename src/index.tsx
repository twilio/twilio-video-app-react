import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import LoginPage from './components/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { SnackbarProvider } from 'notistack';
import theme from './theme';
import './types';
import { VideoProvider } from './components/VideoProvider';
import useConnectionOptions from './utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';

const VideoApp = () => {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <UnsupportedBrowserWarning>
      <VideoProvider options={connectionOptions} onError={setError}>
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <App />
      </VideoProvider>
    </UnsupportedBrowserWarning>
  );
};

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <SnackbarProvider
      maxSnack={8}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      autoHideDuration={10000}
      variant="info"
    >
      <Router>
        <AppStateProvider>
          <Switch>
            <PrivateRoute exact path="/">
              <VideoApp />
            </PrivateRoute>
            <PrivateRoute path="/room/:URLRoomName">
              <VideoApp />
            </PrivateRoute>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Redirect to="/" />
          </Switch>
        </AppStateProvider>
      </Router>
    </SnackbarProvider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
