import React from 'react';
import { styled } from '@material-ui/core/styles';

import LocalVideoPreview from './components/LocalVideoPreview/LocalVideoPreview';
import Menu from './components/Menu/Menu';
import Room from './components/Room/Room';

import useRoomState from './hooks/useRoomState/useRoomState';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
});

const Main = styled('main')({
  height: '100%',
});

export default function App() {
  const roomState = useRoomState();

  return (
    <Container>
      <Menu />
      <Main>
        {roomState === 'disconnected' ? <LocalVideoPreview /> : <Room />}
      </Main>
    </Container>
  );
}
