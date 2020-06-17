import { useState, useEffect } from 'react';
import { LocalAudioTrack, LocalVideoTrack } from 'twilio-video';

type TrackType = LocalAudioTrack | LocalVideoTrack | undefined;

export default function useIsLocalTrackStopped(track: TrackType) {
  const [isStopped, setIsStopped] = useState(track?.isStopped ?? true);

  useEffect(() => {
    setIsStopped(track?.isStopped ?? true);

    if (track) {
      const handleStopped = () => setIsStopped(true);
      const handleStarted = () => setIsStopped(false);
      track.on('stopped', handleStopped);
      track.on('started', handleStarted);
      return () => {
        track.off('stopped', handleStopped);
        track.off('started', handleStarted);
      };
    }
  }, [track]);

  return isStopped;
}
