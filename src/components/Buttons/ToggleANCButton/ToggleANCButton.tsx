import React from 'react';

import Button from '@material-ui/core/Button';
import MicIcon from '../../../icons/MicIcon';
import MicOffIcon from '../../../icons/MicOffIcon';

import useANCToggle from '../../../hooks/useANCToggle/useANCToggle';

export default function ToggleANCButton(props: { disabled?: boolean; className?: string }) {
  const [vendor, isANCEnabled, toggleANC] = useANCToggle();

  return (
    <Button
      className={props.className}
      onClick={toggleANC}
      disabled={!vendor || props.disabled}
      startIcon={isANCEnabled ? <MicIcon /> : <MicOffIcon />}
      data-cy-audio-toggle
    >
      {!vendor ? 'Not Available' : isANCEnabled ? `Disable ${vendor}` : `Enable ${vendor}`}
    </Button>
  );
}
