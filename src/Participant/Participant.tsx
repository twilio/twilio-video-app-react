import React from './node_modules/react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import {
  LocalParticipant,
  RemoteParticipant,
} from './node_modules/twilio-video';

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
