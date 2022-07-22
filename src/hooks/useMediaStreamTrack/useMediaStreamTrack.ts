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
  const [mediaStreamTrack, setMediaStreamTrack] = useState(track?.mediaStreamTrack || null);

  useEffect(() => {
    setMediaStreamTrack(track?.mediaStreamTrack || null);

    if (track) {
      const handleEvent = () => setMediaStreamTrack(track.mediaStreamTrack);
      track.on('started', handleEvent);
      track.on('switchedOn', handleEvent);
      track.on('switchedOff', handleEvent);
      return () => {
        track.off('started', handleEvent);
        track.off('switchedOn', handleEvent);
        track.off('switchedOff', handleEvent);
      };
    }
  }, [track]);

  return mediaStreamTrack;
}
