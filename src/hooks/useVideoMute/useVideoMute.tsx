import { useCallback } from 'react';
import { useVideoContext } from '../context';
import { LocalVideoTrack } from 'twilio-video';
import useTrackIsEnabled from '../useTrackIsEnabled/useTrackIsEnabled';

export default function useVideoMute() {
  const { localTracks } = useVideoContext();
  const videoTrack = localTracks.find(
    track => track.name === 'camera'
  ) as LocalVideoTrack;
  const isEnabled = useTrackIsEnabled(videoTrack);

  const toggleVideoEnabled = useCallback(() => {
    videoTrack.isEnabled ? videoTrack.disable() : videoTrack.enable();
  }, [videoTrack]);

  return [isEnabled, toggleVideoEnabled] as const;
}
