import React from 'react';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import VideoApp from './videoApp';
import AppStateProvider, { useAppState } from './state';
import theme from './theme';
import { BackendProps } from './types';
import UnsupportedBrowserWarning from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';

export default function index(props: React.PropsWithChildren<BackendProps>) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
        <AppStateProvider userName={props.userName}
                          userAvatar={props.userAvatar}
                          token = {props.token}
                          roomName={props.roomName}
                          roomEndTime={props.roomEndTime}
                          appointmentID={props.appointmentID}
                          participantID={props.participantID}
                          userType={props.userType}
                          test={props.test}>
          <UnsupportedBrowserWarning>
            <VideoApp />
          </UnsupportedBrowserWarning>
        </AppStateProvider>
    </MuiThemeProvider>
  )
}
