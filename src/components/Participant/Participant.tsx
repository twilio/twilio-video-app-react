import React from 'react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { Participant as IParticipant } from 'twilio-video';

export interface ParticipantProps {
  participant: IParticipant;
  videoOnly?: boolean;
  enableScreenShare?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  isLocalParticipant?: boolean;
  hideParticipant?: boolean;
  isModerator?: boolean;
  noName?: boolean;
  isActivePlayer?: boolean;
}

const Participant = React.memo(
  ({
    participant,
    videoOnly,
    enableScreenShare,
    onClick,
    isSelected,
    isLocalParticipant,
    hideParticipant,
    isModerator,
    noName,
    isActivePlayer,
  }: ParticipantProps) => {
    return (
      <ParticipantInfo
        participant={participant}
        onClick={onClick}
        isSelected={isSelected}
        isLocalParticipant={isLocalParticipant}
        hideParticipant={hideParticipant}
        isModerator={isModerator}
        noName={noName ?? false}
        isActivePlayer={isActivePlayer}
      >
        <ParticipantTracks
          participant={participant}
          videoOnly={videoOnly}
          enableScreenShare={enableScreenShare}
          isLocalParticipant={isLocalParticipant}
          isActivePlayer={isActivePlayer}
        />
      </ParticipantInfo>
    );
  }
);

export default Participant;
