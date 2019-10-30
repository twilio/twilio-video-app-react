import { useCallback } from 'react';
import { useVideoContext } from '../context';
import { LocalAudioTrack } from 'twilio-video';
import useTrackIsEnabled from '../useTrackIsEnabled/useTrackIsEnabled';

export default function useAudioMute() {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find(
    track => track.name === 'microphone'
  ) as LocalAudioTrack;
  const isEnabled = useTrackIsEnabled(audioTrack);

  const toggleAudioEnabled = useCallback(() => {
    audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
  }, [audioTrack]);

  return [isEnabled, toggleAudioEnabled] as const;
}
