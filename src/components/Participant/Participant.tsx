import React from 'react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';

interface ParticipantProps {
  participant: LocalParticipant | RemoteParticipant;
}

export default function Participant({ participant }: ParticipantProps) {
  return (
    <ParticipantInfo participant={participant}>
      <ParticipantTracks participant={participant} />
    </ParticipantInfo>
  );
}
