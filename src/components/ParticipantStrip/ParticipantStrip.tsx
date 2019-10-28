import React from 'react';
import { useVideoContext } from '../../hooks/context';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import Participant from '../Participant/Participant';

export default function ParticipantStrip() {
  const { room } = useVideoContext();
  const participants = useParticipants();

  return (
    <div>
      <Participant participant={room.localParticipant} />
      {participants.map(participant => (
        <Participant key={participant.sid} participant={participant} />
      ))}
    </div>
  );
}
