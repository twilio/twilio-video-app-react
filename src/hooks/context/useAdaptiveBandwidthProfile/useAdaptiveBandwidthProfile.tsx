import { useEffect } from 'react';
import useScreenShareParticipant from '../../useScreenShareParticipant/useScreenShareParticipant';
import { useVideoContext } from '..';

export default function useAdaptiveBandwidthProfile() {
  const screenShareParticipant = useScreenShareParticipant();
  const {
    room: { localParticipant },
  } = useVideoContext();

  useEffect(() => {
    if (screenShareParticipant) {
      localParticipant.setBandwidthProfile({
        video: {
          mode: 'presentation',
          dominantSpeakerPriority: 'standard',
        },
      });
    } else {
      localParticipant.setBandwidthProfile({
        video: {
          mode: 'collaboration',
          dominantSpeakerPriority: 'high',
        },
      });
    }
  }, [screenShareParticipant]);
}
