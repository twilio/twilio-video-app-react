import React from 'react';

import App from './App';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import './types';
import { ChatProvider } from './components/ChatProvider';
import { VideoProvider } from './components/VideoProvider';
import { useAppState } from './state';
import useConnectionOptions from './utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';

export default function VideoApp() {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();
  return (
    <UnsupportedBrowserWarning>
      <VideoProvider options={connectionOptions} onError={setError}>
        <ErrorDialog dismissError={() => setError(null)} error={error} />
        <ChatProvider>
          <App />
        </ChatProvider>
      </VideoProvider>
    </UnsupportedBrowserWarning>
  );
};
