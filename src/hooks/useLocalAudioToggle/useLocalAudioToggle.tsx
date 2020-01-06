import { useCallback } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';
import { LocalAudioTrack } from 'twilio-video';

export default function useLocalAudioToggle() {
  const {
    room: { localParticipant },
    localTracks,
    getLocalAudioTrack,
  } = useVideoContext();
  const audioTrack = localTracks.find(track => track.name === 'microphone') as LocalAudioTrack;

  const toggleAudioEnabled = useCallback(() => {
    if (audioTrack) {
      if (localParticipant) {
        const localTrackPublication = localParticipant.unpublishTrack(audioTrack);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        localParticipant.emit('trackUnpublished', localTrackPublication);
      }
      audioTrack.stop();
    } else {
      getLocalAudioTrack().then((track: LocalAudioTrack) => {
        if (localParticipant) {
          localParticipant.publishTrack(track);
        }
      });
    }
  }, [audioTrack, localParticipant, getLocalAudioTrack]);

  return [!!audioTrack, toggleAudioEnabled] as const;
}
