import { LocalAudioTrack } from 'twilio-video';
import { useCallback, useEffect } from 'react';
import { useAppState } from '../../state';
import useVideoContext from '../useVideoContext/useVideoContext';

export function useKrispToggle() {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;
  const noiseCancellation = audioTrack && audioTrack.noiseCancellation;
  const vendor = noiseCancellation && noiseCancellation.vendor;
  const { isKrispInstalled, setIsKrispEnabled, isKrispEnabled } = useAppState();

  useEffect(() => {
    // ensure that Krisp is enabled by default if Krisp is installed:
    if (isKrispInstalled && noiseCancellation && isKrispEnabled) {
      noiseCancellation.enable();
      setIsKrispEnabled(true);
    }
  }, [isKrispInstalled, noiseCancellation]);

  const toggleKrisp = useCallback(() => {
    if (isKrispInstalled && noiseCancellation) {
      noiseCancellation[noiseCancellation.isEnabled ? 'disable' : 'enable']().then(() => {
        setIsKrispEnabled(noiseCancellation.isEnabled);
      });
    }
  }, [noiseCancellation, isKrispInstalled]);

  return { vendor, toggleKrisp };
}
