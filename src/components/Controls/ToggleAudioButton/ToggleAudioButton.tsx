import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';

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
      startIcon={isAudioEnabled ? <Mic /> : <MicOff />}
      data-cy-audio-toggle
    >
      {isAudioEnabled ? 'Mute' : 'Unmute'}
    </Button>
  );
}
