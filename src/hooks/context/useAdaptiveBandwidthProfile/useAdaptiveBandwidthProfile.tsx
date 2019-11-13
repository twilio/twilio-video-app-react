import { useEffect } from 'react';
import useScreenShareParticipant from '../../useScreenShareParticipant/useScreenShareParticipant';
import { useVideoContext } from '..';

export default function useAdaptiveBandwidthProfile() {
  const screenShareParticipant = useScreenShareParticipant();
  const {
    room: { localParticipant },
  } = useVideoContext();

  useEffect(() => {
    if (localParticipant) {
      localParticipant.setBandwidthProfile({
        video: screenShareParticipant
          ? {
              mode: 'presentation',
              dominantSpeakerPriority: 'low',
            }
          : {
              mode: 'collaboration',
              dominantSpeakerPriority: 'high',
            },
      });
    }
  }, [screenShareParticipant, localParticipant]);
}
