import { LocalAudioTrack } from 'twilio-video';
import { useCallback } from 'react';
import { useAppState } from '../../state';
import useVideoContext from '../useVideoContext/useVideoContext';

export function useKrispToggle() {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;
  const noiseCancellation = audioTrack && audioTrack.noiseCancellation;
  const vendor = noiseCancellation && noiseCancellation.vendor;
  const { setIsKrispEnabled } = useAppState();

  const toggleKrisp = useCallback(() => {
    if (noiseCancellation) {
      noiseCancellation[noiseCancellation.isEnabled ? 'disable' : 'enable']().then(() => {
        setIsKrispEnabled(noiseCancellation.isEnabled);
      });
    }
  }, [noiseCancellation, setIsKrispEnabled]);

  return { vendor, toggleKrisp };
}
