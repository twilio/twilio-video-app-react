import React from 'react';
import Participant from '../Participant/Participant';
import ParticipantStrip from '../ParticipantStrip/ParticipantStrip';
import { styled } from '@material-ui/core/styles';
import useMainSpeaker from '../../hooks/useMainSpeaker/useMainSpeaker';

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
        {/* audio is disabled for this participant component because this participant's audio 
            is already being rendered in the <ParticipantStrip /> component.  */}
        <Participant participant={mainParticipant} disableAudio />
      </MainParticipantContainer>
    </Container>
  );
}
