import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import VideoApp from './videoApp';
import AppStateProvider, { useAppState } from './state';
import theme from './theme';
import './types';

export default function index(props) {
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
                        userType={props.userType}>
        <VideoApp />
      </AppStateProvider>
    </MuiThemeProvider>
  )
}
