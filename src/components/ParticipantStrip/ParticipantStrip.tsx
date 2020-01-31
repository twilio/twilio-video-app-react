import React from 'react';
import Participant from '../Participant/Participant';
import { styled } from '@material-ui/core/styles';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';

const Container = styled('aside')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: `calc(100% - ${theme.sidebarWidth}px)`,
  left: 0,
  padding: '0.5em',
  overflowY: 'auto',
}));

export default function ParticipantStrip() {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();

  return (
    <Container>
      <Participant
        participant={localParticipant}
        isSelected={selectedParticipant === localParticipant}
        onClick={() => setSelectedParticipant(localParticipant)}
      />
      {participants.map(participant => (
        <Participant
          key={participant.sid}
          participant={participant}
          isSelected={selectedParticipant === participant}
          onClick={() => setSelectedParticipant(participant)}
        />
      ))}
    </Container>
  );
}
