import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Video, { TwilioError } from 'twilio-video';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { EROOR_MESSAGE } from 'utils/displayStrings';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import AppStateProvider, { useAppState } from './state';
import { VideoProvider } from './components/VideoProvider/';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import theme from './theme';
import App from './App';
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 10000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

const connectionOptions = {
  bandwidthProfile: {
    video: {
      mode: 'collaboration',
      dominantSpeakerPriority: 'standard',
      renderDimensions: {
        high: { height: 1080, width: 1920 },
        standard: { height: 720, width: 1280 },
        low: { height: 90, width: 160 },
      },
    },
  },
  dominantSpeaker: true,
  maxAudioBitrate: 12000,
  networkQuality: { local: 1, remote: 1 },
  preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
};

const VideoApp = () => {
  const { error, setError } = useAppState();
  if (!Video.isSupported) {
    return (
      <ErrorDialog dismissError={() => null} error={(EROOR_MESSAGE.UNSUPPORTED_MESSAGE as unknown) as TwilioError} />
    );
  }
  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />
      <App />
    </VideoProvider>
  );
};

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />

    <Router>
      <AppStateProvider>
        <Switch>
          <Route exact path="/">
            <AlertProvider template={AlertTemplate} {...options}>
              <VideoApp />
            </AlertProvider>
          </Route>
        </Switch>
      </AppStateProvider>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);
