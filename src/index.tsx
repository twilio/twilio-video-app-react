import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types';
import { ChatProvider } from './components/ChatProvider';
import { VideoProvider } from './components/VideoProvider';
import useConnectionOptions from './hooks/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import { SessionProvider } from './components/SessionProvider';
import { SessionWrapper } from './components/SessionWrapper';
import { GameProvider } from './components/GameProvider';
import { RaisedHandsProvider } from 'components/AdminWindowProvider';

const VideoApp = () => {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <SessionProvider>
        <SessionWrapper>
          <GameProvider>
            <ErrorDialog dismissError={() => setError(null)} error={error} />
            <ChatProvider>
              <RaisedHandsProvider>
                <App />
              </RaisedHandsProvider>
            </ChatProvider>
          </GameProvider>
        </SessionWrapper>
      </SessionProvider>
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
            <PrivateRoute path="/r/:URLShareToken">
              <VideoApp />
            </PrivateRoute>
            <Redirect to="/" />
          </Switch>
        </AppStateProvider>
      </Router>
    </UnsupportedBrowserWarning>
  </MuiThemeProvider>,
  document.getElementById('root')
);
