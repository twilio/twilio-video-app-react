import React from 'react';
import MicIcon from '../../../icons/MicIcon';
import MicOffIcon from '../../../icons/MicOffIcon';

import useLocalAudioToggle from '../../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { RoundButton } from '../RoundButton';

export default function ToggleAudioButton(props: { disabled: boolean }) {
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some(track => track.kind === 'audio');

  return (
    <RoundButton onClick={toggleAudioEnabled} disabled={!hasAudioTrack || props.disabled} data-cy-audio-toggle>
      {isAudioEnabled ? <MicIcon className="w-3" /> : <MicOffIcon className="w-5" />}
    </RoundButton>
  );
}
