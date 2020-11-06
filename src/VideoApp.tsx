import React from 'react';
// todo: need this somewhere import { CssBaseline } from '@material-ui/core';

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
    <UnsupportedBrowserWarning>
      <VideoProvider options={connectionOptions} onError={setError}>
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <App userName={userName} roomName={roomName} />
      </VideoProvider>
    </UnsupportedBrowserWarning>
  );
}
