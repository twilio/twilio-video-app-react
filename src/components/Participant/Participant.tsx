import React from 'react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';

interface ParticipantProps {
  participant: LocalParticipant | RemoteParticipant;
  disableAudio?: boolean;
}

export default function Participant({
  participant,
  disableAudio,
}: ParticipantProps) {
  return (
    <ParticipantInfo participant={participant}>
      <ParticipantTracks
        participant={participant}
        disableAudio={disableAudio}
      />
    </ParticipantInfo>
  );
}
