import React from 'react';
import ParticipantStrip from '../ParticipantStrip/ParticipantStrip';
import { styled } from '@material-ui/core/styles';
import MainParticipant from '../MainParticipant/MainParticipant';

const Container = styled('div')({
  position: 'relative',
  height: '100%',
});

const MainParticipantContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'absolute',
  left: theme.sidebarWidth,
  right: 0,
  top: 0,
  bottom: 0,
  '& > div': {
    height: '100%',
  },
  [theme.breakpoints.down('xs')]: {
    left: 0,
    bottom: theme.sidebarMobileHeight,
  },
}));

export default function Room() {
  return (
    <Container>
      <ParticipantStrip />
      <MainParticipantContainer>
        <MainParticipant />
      </MainParticipantContainer>
    </Container>
  );
}
