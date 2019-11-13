import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Provider as ReduxProvider } from 'react-redux';
import store, { useSelector } from './store';
import './types';

import App from './App';
import { ConnectOptions } from 'twilio-video';
import theme from './theme';
import './types';
import { VideoProvider } from './hooks/context';

const connectionOptions: ConnectOptions = {
  dominantSpeaker: true,
  networkQuality: {
    local: 1,
    remote: 1,
  },
  bandwidthProfile: {
    video: {
      dominantSpeakerPriority: 'high',
      mode: 'collaboration',
    },
  },
  preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
};

const VideoProviderWithToken = () => {
  const token = useSelector(state => state.token);

  return (
    <VideoProvider token={token} options={connectionOptions}>
      <App />
    </VideoProvider>
  );
};

ReactDOM.render(
  <ReduxProvider store={store}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <VideoProviderWithToken />
    </MuiThemeProvider>
  </ReduxProvider>,
  document.getElementById('root')
);
