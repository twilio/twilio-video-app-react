import { LocalAudioTrack } from 'twilio-video';
import { useCallback, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useANCToggle() {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;
  const noiseCancellation = audioTrack && audioTrack.noiseCancellation;
  const vendor = noiseCancellation && noiseCancellation.vendor;
  const [isEnabled, setIsEnabled] = useState(noiseCancellation && noiseCancellation.isEnabled);

  const toggleANC = useCallback(() => {
    if (noiseCancellation) {
      noiseCancellation.isEnabled ? noiseCancellation.disable() : noiseCancellation.enable();
      setTimeout(() => {
        setIsEnabled(noiseCancellation.isEnabled);
      }, 1000);
    }
  }, [noiseCancellation]);

  return [vendor, isEnabled, toggleANC] as const;
}
