import React from 'react';
import { useVideoContext } from '../../hooks/context';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import Participant from '../Participant/Participant';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
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
      <ParticipantInfo participant={room.localParticipant}>
        <Participant participant={room.localParticipant} isLocal />
      </ParticipantInfo>
      {participants.map(participant => (
        <ParticipantInfo key={participant.sid} participant={participant}>
          <Participant participant={participant} />
        </ParticipantInfo>
      ))}
    </Container>
  );
}
