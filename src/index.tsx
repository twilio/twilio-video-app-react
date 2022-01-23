import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types/types';
import { ChatProvider } from './components/ChatProvider';
import { VideoProvider } from './components/VideoProvider';
import useConnectionOptions from './hooks/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import { SessionProvider } from './components/SessionProvider';
import { SessionWrapper } from './components/SessionWrapper';
import { GameProvider } from './components/GameProvider';
import { RaisedHandsProvider } from 'components/AdminWindowProvider';
import { LanguageProvider } from 'components/LanguageProvider';
import { CreateSession } from 'components/Layouts/CreateSession';

const VideoApp = () => {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <LanguageProvider>
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
    </LanguageProvider>
  );
};

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <UnsupportedBrowserWarning>
      <Router>
        <AppStateProvider>
          <Switch>
            <Route path="/r/:URLShareToken">
              <VideoApp />
            </Route>
            <PrivateRoute path="/create/xrJIGtmpgV3nGTZQhHZQsdvfM/DHxsbJ1Nd6eTlRfOtJAJXPOB1">
              <CreateSession />
            </PrivateRoute>
            <Redirect to="/" />
          </Switch>
        </AppStateProvider>
      </Router>
    </UnsupportedBrowserWarning>
  </MuiThemeProvider>,
  document.getElementById('root')
);
