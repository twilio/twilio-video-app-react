import React from 'react';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import VideoApp from './videoApp';
import AppStateProvider from './state';
import theme from './theme';

export default function index(props: React.PropsWithChildren<{}>) {
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
            <VideoApp />
        </AppStateProvider>
    </MuiThemeProvider>
  )
}
