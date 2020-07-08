import { useState, useEffect } from 'react';
import { AudioTrack, VideoTrack } from 'twilio-video';

export default function useMediaStreamTrack(track?: AudioTrack | VideoTrack) {
  const [mediaStreamTrack, setMediaStreamTrack] = useState(track?.mediaStreamTrack);

  useEffect(() => {
    setMediaStreamTrack(track?.mediaStreamTrack);

    if (track) {
      const handleStarted = () => setMediaStreamTrack(track.mediaStreamTrack);

      track.on('started', handleStarted);
      return () => {
        track.off('started', handleStarted);
      };
    }
  }, [track]);

  return mediaStreamTrack;
}
