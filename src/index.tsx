import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import VideoApp from './VideoApp';
import AppStateProvider from './state';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { SnackbarProvider } from 'notistack';
import theme from './theme';
import './types';

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
