import React from 'react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { Participant as IParticipant, Track } from 'twilio-video';

export interface ParticipantProps {
  participant: IParticipant;
  videoOnly?: boolean;
  enableScreenShare?: boolean;
  onClick?: () => void;
  // isSelected?: boolean;
  isLocalParticipant?: boolean;
  hideParticipant?: boolean;
  isModerator?: boolean;
  noName?: boolean;
  isActivePlayer?: boolean;
  roundsPlayed?: number;
  videoPriority?: Track.Priority;
}

const Participant = ({
  participant,
  videoOnly,
  // enableScreenShare,
  onClick,
  // isSelected,
  isLocalParticipant,
  hideParticipant,
  isModerator,
  noName,
  isActivePlayer,
  roundsPlayed,
  videoPriority,
}: ParticipantProps) => {
  return (
    <ParticipantInfo
      participant={participant}
      onClick={onClick}
      // isSelected={isSelected}
      isLocalParticipant={isLocalParticipant}
      hideParticipant={hideParticipant}
      isModerator={isModerator}
      noName={noName ?? false}
      isActivePlayer={isActivePlayer}
      roundsPlayed={roundsPlayed}
    >
      <ParticipantTracks
        participant={participant}
        videoOnly={videoOnly}
        // enableScreenShare={enableScreenShare}
        videoPriority={videoPriority}
        isLocalParticipant={isLocalParticipant}
        isActivePlayer={isActivePlayer}
      />
    </ParticipantInfo>
  );
};

export default Participant;
