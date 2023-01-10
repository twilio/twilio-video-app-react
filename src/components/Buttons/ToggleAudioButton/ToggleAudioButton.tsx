import React from 'react';

import Button from '@material-ui/core/Button';
import MicIcon from '../../../icons/MicIcon';
import MicMutedIcon from '../../../icons/MicMutedIcon';
import MicOffIcon from '../../../icons/MicOffIcon';

import useLocalAudioToggle from '../../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export default function ToggleAudioButton(props: { disabled?: boolean; className?: string; isAudioMuted?: boolean }) {
  const { className, disabled, isAudioMuted } = props;
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some(track => track.kind === 'audio');

  return (
    <Button
      className={className}
      onClick={toggleAudioEnabled}
      disabled={!hasAudioTrack || isAudioMuted || disabled}
      startIcon={isAudioEnabled && !isAudioMuted ? <MicIcon /> : isAudioMuted ? <MicMutedIcon /> : <MicOffIcon />}
      data-cy-audio-toggle
    >
      {!hasAudioTrack ? 'No Audio' : isAudioEnabled && !isAudioMuted ? 'Mute' : isAudioMuted ? 'Audio Lost' : 'Unmute'}
    </Button>
  );
}
