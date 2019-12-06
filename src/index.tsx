import React from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';

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
import { setError, dismissError, clearToken } from './store/main/main';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';

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
};

const VideoProviderWithToken = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.token);
  const error = useSelector(state => state.error);

  return (
    <VideoProvider
      token={token}
      options={connectionOptions}
      onError={err => dispatch(setError(err))}
      onDisconnect={() => dispatch(clearToken())}
    >
      <ErrorDialog dismissError={() => dispatch(dismissError())} error={error} />
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
