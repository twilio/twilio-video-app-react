import React from 'react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { Participant as IParticipant } from 'twilio-video';

interface ParticipantProps {
  participant: IParticipant;
  disableAudio?: boolean;
  enableScreenShare?: boolean;
  onClick: () => void;
  isSelected: boolean;
  gridView: any;
}

export default function Participant({
  participant,
  disableAudio,
  enableScreenShare,
  onClick,
  isSelected,
  gridView,
}: ParticipantProps) {
  return (
    <ParticipantInfo participant={participant} onClick={onClick} isSelected={isSelected} gridView={gridView}>
      <ParticipantTracks participant={participant} disableAudio={disableAudio} />
    </ParticipantInfo>
  );
}
