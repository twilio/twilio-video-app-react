import MainParticipantInfo from '../MainParticipantInfo/MainParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import React from 'react';
import useDominantSpeaker from '../../hooks/useDominantSpeaker/useDominantSpeaker';
import useMainSpeaker from '../../hooks/useMainSpeaker/useMainSpeaker';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';

export default function MainParticipant() {
  const mainParticipant = useMainSpeaker();
  const dominantSpeaker = useDominantSpeaker();
  const screenShareParticipant = useScreenShareParticipant();

  const videoPriority =
    mainParticipant !== dominantSpeaker && mainParticipant !== screenShareParticipant ? 'high' : null;

  return (
    /* audio is disabled for this participant component because this participant's audio 
       is already being rendered in the <ParticipantStrip /> component.  */
    <MainParticipantInfo participant={mainParticipant}>
      <ParticipantTracks participant={mainParticipant} disableAudio enableScreenShare videoPriority={videoPriority} />
    </MainParticipantInfo>
  );
}
