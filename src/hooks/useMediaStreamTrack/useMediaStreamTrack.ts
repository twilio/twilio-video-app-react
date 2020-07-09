import { useState, useEffect } from 'react';
import { AudioTrack, VideoTrack } from 'twilio-video';

/*
 * This hook allows components to reliably use the 'mediaStreamTrack' property of
 * an AudioTrack or a VideoTrack. Whenever 'localTrack.restart(...)' is called, it
 * will replace the mediaStreamTrack property of the localTrack, but the localTrack
 * object will stay the same. Therefore this hook is needed in order for components
 * to rerender in response to the mediaStreamTrack changing.
 */
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
