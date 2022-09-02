import { LocalAudioTrack } from 'twilio-video';
import { useCallback, useEffect, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';

export function useKrispToggle() {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;
  const noiseCancellation = audioTrack && audioTrack.noiseCancellation;
  const vendor = noiseCancellation && noiseCancellation.vendor;
  const [isKrispEnabled, setIsKrispEnabled] = useState(noiseCancellation && noiseCancellation.isEnabled);

  useEffect(() => {
    if (audioTrack?.noiseCancellation) {
      const options: MediaTrackConstraints = { noiseSuppression: !isKrispEnabled };

      const deviceId = audioTrack.noiseCancellation.sourceTrack.getSettings().deviceId;

      if (deviceId) {
        options.deviceId = { exact: deviceId };
      }
      audioTrack.restart(options);
    }
  }, [isKrispEnabled, audioTrack]);

  const toggleKrisp = useCallback(() => {
    if (noiseCancellation) {
      noiseCancellation[noiseCancellation.isEnabled ? 'disable' : 'enable']().then(() =>
        setIsKrispEnabled(noiseCancellation.isEnabled)
      );
    }
  }, [noiseCancellation]);

  return [vendor, isKrispEnabled, toggleKrisp] as const;
}
