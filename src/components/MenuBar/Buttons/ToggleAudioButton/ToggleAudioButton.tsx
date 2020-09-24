import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import MicIcon from '../../../../icons/MicIcon';
import MicOffIcon from '../../../../icons/MicOffIcon';

import useLocalAudioToggle from '../../../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useVideoContext from '../../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  })
);

export default function ToggleAudioButton(props: { disabled?: boolean; className?: string }) {
  const classes = useStyles();
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some(track => track.kind === 'audio');

  return (
    <Button
      className={clsx(classes.fab, props.className)}
      onClick={toggleAudioEnabled}
      disabled={!hasAudioTrack || props.disabled}
      startIcon={isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
      data-cy-audio-toggle
    >
      {!hasAudioTrack ? 'No Audio' : isAudioEnabled ? 'Mute' : 'Unmute'}
    </Button>
  );
}
