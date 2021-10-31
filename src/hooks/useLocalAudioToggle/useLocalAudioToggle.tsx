import { LocalAudioTrack } from 'twilio-video';
import { useCallback, useEffect } from 'react';
import useIsTrackEnabled from '../useIsTrackEnabled/useIsTrackEnabled';
import useVideoContext from '../useVideoContext/useVideoContext';
import { subscribeToSessionStore, unmuteParticipant } from 'utils/firebase/session';
import useSessionContext from 'hooks/useSessionContext';

export default function useLocalAudioToggle() {
  const { localTracks, room } = useVideoContext();
  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;
  const isEnabled = useIsTrackEnabled(audioTrack);
  const { groupToken } = useSessionContext();

  const enableAudio = () => {
    if (!groupToken || !room) {
      return;
    }

    unmuteParticipant(groupToken, room!.localParticipant.sid);
    audioTrack.enable();
  };

  const toggleAudioEnabled = useCallback(() => {
    if (audioTrack) {
      audioTrack.isEnabled ? audioTrack.disable() : enableAudio();
    }
  }, [audioTrack]);

  useEffect(() => {
    if (!groupToken) {
      return;
    }

    subscribeToSessionStore('useLocalAudioToggle', groupToken, store => {
      if (room?.localParticipant && store.data.muted?.includes(room?.localParticipant.sid)) {
        audioTrack.disable();
      }
    });
  }, [groupToken]);

  return [isEnabled, toggleAudioEnabled] as const;
}
