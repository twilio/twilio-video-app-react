import { LocalAudioTrack } from 'twilio-video';
import { useCallback } from 'react';
import useIsTrackEnabled from '../useIsTrackEnabled/useIsTrackEnabled';
import useVideoContext from '../useVideoContext/useVideoContext';
import { TRACK_TYPE } from '../../utils/displayStrings';
import { ROOM_STATE } from 'utils/displayStrings';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useIsHostIn from '../../hooks/useIsHosetIn/useIsHostIn';

export default function useLocalAudioToggle() {
  const { localTracks } = useVideoContext();
  const roomState = useRoomState();

  const audioTrack = localTracks.find(track => track.kind === TRACK_TYPE.AUDIO) as LocalAudioTrack;
  let isEnabled = useIsTrackEnabled(audioTrack);

  const toggleAudioEnabled = useCallback(() => {
    if (roomState !== ROOM_STATE.DISCONNECTED) {
      if (!useIsHostIn()) {
        console.log('use room');
        audioTrack?.disable();
        alert('waiting for reporter to join');
        isEnabled = false;
        // toggleAudioButton({ disabled: true });
      } else {
        audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
      }
    } else {
      audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
    }
  }, [audioTrack]);

  return [isEnabled, toggleAudioEnabled] as const;
}
