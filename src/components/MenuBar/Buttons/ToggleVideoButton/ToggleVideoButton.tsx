import React, { useCallback, useRef } from 'react';
import clsx from 'clsx';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import VideoOffIcon from './VideoOffIcon';
import VideoOnIcon from './VideoOnIcon';

import useLocalVideoToggle from '../../../../hooks/useLocalVideoToggle/useLocalVideoToggle';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  })
);

export default function ToggleVideoButton(props: { disabled?: boolean; className?: string }) {
  const classes = useStyles();
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const lastClickTimeRef = useRef(0);

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 200) {
      lastClickTimeRef.current = Date.now();
      toggleVideoEnabled();
    }
  }, [toggleVideoEnabled]);

  return (
    <Button
      className={clsx(classes.button, props.className)}
      onClick={toggleVideo}
      disabled={props.disabled}
      startIcon={isVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}
    >
      {isVideoEnabled ? 'Stop Video' : 'Start Video'}
    </Button>
  );
}
