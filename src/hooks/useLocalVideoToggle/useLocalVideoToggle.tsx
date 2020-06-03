import { LocalVideoTrack } from 'twilio-video';
import { useCallback } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useLocalVideoToggle() {
  const { localTracks, getLocalVideoTrack, isPublishingLocalVideoTrack } = useVideoContext();
  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;

  const toggleVideoEnabled = useCallback(() => {
    if (isPublishingLocalVideoTrack) return;

    if (videoTrack) {
      videoTrack.stop();
    } else {
      getLocalVideoTrack();
    }
  }, [videoTrack, getLocalVideoTrack, isPublishingLocalVideoTrack]);

  return [!!videoTrack, toggleVideoEnabled] as const;
}
