import React from 'react';
import { styled } from '@material-ui/core/styles';

import LocalVideoPreview from './components/LocalVideoPreview/LocalVideoPreview';
import Menu from './components/Menu/Menu';

import useRoomState from './hooks/useRoomState/useRoomState';
import { useVideoContext } from './hooks/context';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
});

const Main = styled('main')({
  height: '100%',
});

export default function Room() {
  const roomState = useRoomState();
  const { room } = useVideoContext();

  return (
    <Container>
      <Menu />
      <Main>
        {roomState === 'disconnected' ? (
          <LocalVideoPreview />
        ) : (
          <p>You have joined room {room.name}</p>
        )}
      </Main>
    </Container>
  );
}
