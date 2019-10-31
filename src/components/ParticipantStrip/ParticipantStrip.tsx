import React from 'react';
import Participant from '../Participant/Participant';
import { styled } from '@material-ui/core/styles';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import { useVideoContext } from '../../hooks/context';

const Container = styled('aside')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: `calc(100% - ${theme.sidebarPosition})`,
  left: 0,
  padding: '0.5em',
}));

export default function ParticipantStrip() {
  const { room } = useVideoContext();
  const participants = useParticipants();

  return (
    <Container>
      <Participant participant={room.localParticipant} />
      {participants.map(participant => (
        <Participant key={participant.sid} participant={participant} />
      ))}
    </Container>
  );
}
