import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { ConnectOptions } from 'twilio-video';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import theme from './theme';
import './types';
import { VideoProvider } from './components/VideoProvider';

// See: https://media.twiliocdn.com/sdk/js/video/releases/2.0.0/docs/global.html#ConnectOptions
// for available connection options.

const connectionOptions: ConnectOptions = {
  dominantSpeaker: true,
  networkQuality: {
    local: 1,
    remote: 1,
  },
  bandwidthProfile: {
    video: {
      mode: 'collaboration',
      dominantSpeakerPriority: 'standard',
      renderDimensions: {
        standard: {
          // same as low
          width: 176,
          height: 144,
        },
      },
    },
  },
  preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
  trackSwitchOffMode: 'detected',
};

const VideoProviderWithToken = () => {
  const { error, token, setError, setToken } = useAppState();

  return (
    <VideoProvider token={token} options={connectionOptions} onError={setError} onDisconnect={() => setToken('')}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />
      <App />
    </VideoProvider>
  );
};

ReactDOM.render(
  <AppStateProvider>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <VideoProviderWithToken />
    </MuiThemeProvider>
  </AppStateProvider>,
  document.getElementById('root')
);
