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
import theme from './theme';
import './types';
import { ChatProvider } from './components/ChatProvider';
import { VideoProvider } from './components/VideoProvider';
import { GameProvider } from './components/GameProvider';
import useConnectionOptions from './hooks/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import { SessionProvider } from './components/SessionProvider';
import { SessionWrapper } from './components/SessionWrapper';

const VideoApp = () => {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <GameProvider>
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <ChatProvider>
          <App />
        </ChatProvider>
      </GameProvider>
    </VideoProvider>
  );
};

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <UnsupportedBrowserWarning>
      <Router>
        <AppStateProvider>
          <Switch>
            {/* <PrivateRoute exact path="/">
              <VideoApp />
            </PrivateRoute> */}
            {/* <PrivateRoute path="/room/:URLRoomName">
              <VideoApp />
            </PrivateRoute> */}
            <PrivateRoute path="/r/:URLShareToken">
              <SessionProvider>
                <SessionWrapper>
                  <VideoApp />
                </SessionWrapper>
              </SessionProvider>
            </PrivateRoute>
            {/* <Route path="/login">
              <LoginPage />
            </Route> */}
            <Redirect to="/" />
          </Switch>
        </AppStateProvider>
      </Router>
    </UnsupportedBrowserWarning>
  </MuiThemeProvider>,
  document.getElementById('root')
);
