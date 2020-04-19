import React from 'react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { Participant as IParticipant } from 'twilio-video';

interface ParticipantProps {
  participant: IParticipant;
  disableAudio: boolean;
  enableScreenShare?: boolean;
  onClick: () => void;
  isSelected: boolean;
  hideParticipant: boolean;
}

export default function Participant({
  participant,
  disableAudio,
  enableScreenShare,
  onClick,
  isSelected,
  hideParticipant,
}: ParticipantProps) {
  return (
    <ParticipantInfo
      hideParticipant={hideParticipant}
      participant={participant}
      disableAudio={disableAudio}
      onClick={onClick}
      isSelected={isSelected}
    >
      <ParticipantTracks
        participant={participant}
        disableAudio={disableAudio}
        enableScreenShare={enableScreenShare && participant.identity.split('|')[1] !== 'True'}
      />
    </ParticipantInfo>
  );
}
