import MainParticipantInfo from '../MainParticipantInfo/MainParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import React from 'react';
import { useVideoContext } from '../../main';

export default function MainParticipant() {
  const { room: { localParticipant } } = useVideoContext();

  return (
    <MainParticipantInfo participant={localParticipant}>
      <ParticipantTracks
        participant={localParticipant}
        disableAudio
        enableScreenShare
        videoPriority={'high'}
      />
    </MainParticipantInfo>
  );
}
