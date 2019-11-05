import { useCallback } from 'react';
import { useVideoContext } from '../context';
import { LocalAudioTrack } from 'twilio-video';
import useIsTrackEnabled from '../useIsTrackEnabled/useIsTrackEnabled';

export default function useLocalAudioToggle() {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find(track => track.name === 'microphone') as LocalAudioTrack;
  const isEnabled = useIsTrackEnabled(audioTrack);

  const toggleAudioEnabled = useCallback(() => {
    if (audioTrack) {
      audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
    }
  }, [audioTrack]);

  return [isEnabled, toggleAudioEnabled] as const;
}
