import React from 'react';
import { useVideoContext } from '../../hooks/context';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import Participant from '../Participant/Participant';
import { styled } from '@material-ui/core/styles';

const Container = styled('aside')({
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: '85%',
  left: 0,
  padding: '0.5em',
});

export default function ParticipantStrip() {
  const { room } = useVideoContext();
  const participants = useParticipants();

  return (
    <Container>
      <Participant participant={room.localParticipant} isLocal />
      {participants.map(participant => (
        <Participant key={participant.sid} participant={participant} />
      ))}
    </Container>
  );
}
