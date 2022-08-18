import { LocalAudioTrack } from 'twilio-video';
import { useCallback, useEffect, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useANCToggle() {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;
  const noiseCancellation = audioTrack && audioTrack.noiseCancellation;
  const vendor = noiseCancellation && noiseCancellation.vendor;
  const [isEnabled, setIsEnabled] = useState(noiseCancellation && noiseCancellation.isEnabled);

  useEffect(() => {
    if (audioTrack.noiseCancellation) {
      const options: MediaTrackConstraints = { noiseSuppression: !isEnabled };

      const deviceId = audioTrack.noiseCancellation.sourceTrack.getSettings().deviceId;

      if (deviceId) {
        options.deviceId = { exact: deviceId };
      }
      audioTrack.restart(options);
    }
  }, [isEnabled, audioTrack]);

  const toggleANC = useCallback(() => {
    if (noiseCancellation) {
      noiseCancellation[noiseCancellation.isEnabled ? 'disable' : 'enable']().then(() =>
        setIsEnabled(noiseCancellation.isEnabled)
      );
    }
  }, [noiseCancellation]);

  return [vendor, isEnabled, toggleANC] as const;
}
