import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import App from './App';
import { useAppState } from './state';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import { VideoProvider } from './components/VideoProvider';
import useConnectionOptions from './utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';

interface VideoAppProps {
  userName?: string;
  roomName?: string;
}

export default function VideoApp({ userName, roomName }: VideoAppProps) {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <MuiThemeProvider theme={theme}>
      <UnsupportedBrowserWarning>
        <VideoProvider options={connectionOptions} onError={setError}>
          <ErrorDialog dismissError={() => setError(null)} error={error} />
          <App userName={userName} roomName={roomName} />
        </VideoProvider>
      </UnsupportedBrowserWarning>
    </MuiThemeProvider>
  );
}
