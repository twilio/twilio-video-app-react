import React, { useEffect } from 'react';
import { styled } from '@material-ui/core/styles';

import Controls from './components/Controls/Controls';
import LocalVideoPreview from './components/LocalVideoPreview/LocalVideoPreview';
import MenuBar, { DEFAULT_ROOM_NAME } from './components/MenuBar/MenuBar';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import Room from './components/Room/Room';

import { useAppState } from './state';
import { useParams } from 'react-router-dom';
import useHeight from './hooks/useHeight/useHeight';
import useVideoContext from './hooks/useVideoContext/useVideoContext';
import useRoomState from './hooks/useRoomState/useRoomState';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
});

const Main = styled('main')({
  overflow: 'hidden',
});

export default function App() {
  const roomState = useRoomState();

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  const { IdentityID, URLRoomName } = useParams();
  const { setError, getToken } = useAppState();
  const { connect } = useVideoContext();

  useEffect(() => {
    if (!IdentityID) {
      setError(new Error('Identity not found'));

      return;
    }

    getToken(IdentityID, URLRoomName || DEFAULT_ROOM_NAME).then(token => connect(token));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container style={{ height }}>
      <MenuBar />
      <Main>
        {roomState === 'disconnected' ? <LocalVideoPreview /> : <Room />}
        <Controls />
      </Main>
      <ReconnectingNotification />
    </Container>
  );
}
