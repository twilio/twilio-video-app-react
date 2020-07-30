import React from 'react'

import AppStateProvider, { useAppState } from '../../../src/state'
import { VideoProvider } from '../../../src/components/VideoProvider'

import UnsupportedBrowserWarning from '../UnsupportedBrowserWarning'
import generateConnectionOptions from '../../../src/utils/generateConnectionOptions/generateConnectionOptions';

const AlucioVideoProvider: React.FC = (props) => {
  const { children } = props;
  const { setError, settings } = useAppState()
  const connectionOptions = generateConnectionOptions(settings)

  return (
    <UnsupportedBrowserWarning>
      <VideoProvider
        options={connectionOptions}
        onError={setError}
      >
        { children }
      </VideoProvider>
    </UnsupportedBrowserWarning>
  )
}

const WithAppState = (Component: React.FC):React.FC => (props) => {
  return (
    <AppStateProvider>
      <Component {...props} />
    </AppStateProvider>
  )
}

export default WithAppState(AlucioVideoProvider)
