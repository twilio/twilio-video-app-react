import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import MicIcon from './MicIcon';
import MicOffIcon from './MicOffIcon';

import useLocalAudioToggle from '../../../hooks/useLocalAudioToggle/useLocalAudioToggle';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  })
);

export default function ToggleAudioButton(props: { disabled?: boolean }) {
  const classes = useStyles();
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();

  return (
    <Button
      className={classes.fab}
      onClick={toggleAudioEnabled}
      disabled={props.disabled}
      startIcon={isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
      data-cy-audio-toggle
    >
      {isAudioEnabled ? 'Mute' : 'Unmute'}
    </Button>
  );
}
