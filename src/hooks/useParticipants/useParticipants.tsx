import { useEffect, useState } from 'react';
import { RemoteParticipant } from 'twilio-video';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import useVideoContext from '../useVideoContext/useVideoContext';
import { PARTICIANT_TYPES } from '../../utils/participantTypes';

export default function useParticipants() {
  const { room } = useVideoContext();
  const dominantSpeaker = useDominantSpeaker();
  const [participants, setParticipants] = useState(Array.from(room.participants.values()));
  const [isHostIn, setIsHostIn] = useState(false);
  const [useDominantSpeakerEffect] = useState(false);

  // When the dominant speaker changes, they are moved to the front of the participants array.
  // This means that the most recent dominant speakers will always be near the top of the
  // ParticipantStrip component.
  useEffect(() => {
    if (dominantSpeaker && useDominantSpeakerEffect) {
      console.log(useDominantSpeakerEffect);
      setParticipants(prevParticipants => [
        dominantSpeaker,
        ...prevParticipants.filter(participant => participant !== dominantSpeaker),
      ]);
    }
  }, [dominantSpeaker, useDominantSpeakerEffect]);

  useEffect(() => {
    const participantConnected = (participant: RemoteParticipant) => {
      if (participant.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER) {
        //  setIsHostIn(true);
        // console.log('host in');
        // }
        // if (isHostIn) {
        room.localParticipant.audioTracks.forEach(function(audioTrack) {
          audioTrack.track.enable();
        });
        room.localParticipant.videoTracks.forEach(function(videoTrack) {
          videoTrack.track.enable();
        });
      }
      /*else if (!isHostIn) {
        
        console.log('got here any way');
        room.localParticipant.audioTracks.forEach(function(audioTrack) {
          audioTrack.track.disable();
        });
        console.log('i got here');
        //  toggleAudioButton({ disabled: true });
        alert('waiting for reporter to join');
      }*/
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant: RemoteParticipant) => {
      if (participant.identity.split('@')[1] === PARTICIANT_TYPES.REPORTER) {
        // setIsHostIn(false);
        room.localParticipant.audioTracks.forEach(function(audioTrack) {
          audioTrack.track.disable();
        });
        room.localParticipant.videoTracks.forEach(function(videoTrack) {
          videoTrack.track.disable();
        });
        alert('waiting for reporter to join');
      }
      setParticipants(prevParticipants => prevParticipants.filter(p => p !== participant));
    };

    room.on('participantConnected', participantConnected);
    room.on('participantDisconnected', participantDisconnected);
    return () => {
      room.off('participantConnected', participantConnected);
      room.off('participantDisconnected', participantDisconnected);
    };
  }, [room]);

  return participants;
}
