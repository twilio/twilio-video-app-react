import React from 'react';
import ParticipantStrip from '../ParticipantStrip/ParticipantStrip';
import { styled } from '@material-ui/core/styles';
import useMainSpeaker from '../../hooks/useMainSpeaker/useMainSpeaker';
import Participant from '../Participant/Participant';
import { Theme } from 'pretty-format/build/types';

const Container = styled('div')({
  position: 'relative',
  height: '100%',
});

const MainParticipantContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: theme.sidebarPosition,
  right: 0,
  top: 0,
  bottom: 0,
  '& > div': {
    height: '100%',
  },
}));

export default function Room() {
  const mainParticipant = useMainSpeaker();
  return (
    <Container>
      <ParticipantStrip />
      <MainParticipantContainer>
        <Participant participant={mainParticipant} />
      </MainParticipantContainer>
    </Container>
  );
}
