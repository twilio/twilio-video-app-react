import { LocalAudioTrack } from 'twilio-video';
import { useCallback } from 'react';
import useIsTrackEnabled from '../useIsTrackEnabled/useIsTrackEnabled';
import useVideoContext from '../useVideoContext/useVideoContext';
import useIsLocalTrackStopped from '../useIsLocalTrackStopped/useIsLocalTrackStopped';

export default function useLocalAudioToggle() {
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;
  const isEnabled = useIsTrackEnabled(audioTrack);
  const isStopped = useIsLocalTrackStopped(audioTrack);

  const toggleAudioEnabled = useCallback(() => {
    if (audioTrack && !isStopped) {
      audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
    }
  }, [audioTrack, isStopped]);

  return [isEnabled && !isStopped, toggleAudioEnabled] as const;
}
