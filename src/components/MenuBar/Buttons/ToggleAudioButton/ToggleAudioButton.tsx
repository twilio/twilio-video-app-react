import React from 'react';

import Button from '@material-ui/core/Button';
import MicIcon from '../../../../icons/MicIcon';
import MicOffIcon from '../../../../icons/MicOffIcon';

import useLocalAudioToggle from '../../../../hooks/useLocalAudioToggle/useLocalAudioToggle';

export default function ToggleAudioButton(props: { disabled?: boolean; className?: string }) {
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();

  return (
    <Button
      className={props.className}
      onClick={toggleAudioEnabled}
      disabled={props.disabled}
      startIcon={isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
      data-cy-audio-toggle
    >
      {isAudioEnabled ? 'Mute' : 'Unmute'}
    </Button>
  );
}
