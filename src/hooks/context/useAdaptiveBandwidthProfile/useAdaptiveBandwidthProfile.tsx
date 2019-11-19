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
      const isRemoteParticipantScreenSharing = screenShareParticipant && screenShareParticipant !== localParticipant;
      localParticipant.setBandwidthProfile({
        video: isRemoteParticipantScreenSharing
          ? {
              mode: 'presentation',
            }
          : {
              mode: 'collaboration',
            },
      });
    }
  }, [screenShareParticipant, localParticipant]);
}
