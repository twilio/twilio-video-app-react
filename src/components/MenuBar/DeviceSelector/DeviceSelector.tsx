import React from 'react';

import AudioInputList from './AudioInputList/AudioInputList';
import AudioOutputList from './AudioOutputList/AudioOutputList';
import { DialogContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import VideoInputList from './VideoInputList/VideoInputList';

const useStyles = makeStyles({
  listSection: {
    margin: '2em 0',
    '&:first-child': {
      margin: '1em 0 2em 0',
    },
  },
});

export function DeviceSelector({ className, hidden }: { className?: string; hidden?: boolean }) {
  const classes = useStyles();

  return (
    <DialogContent className={className} hidden={hidden}>
      <div className={classes.listSection}>
        <AudioInputList />
      </div>
      <div className={classes.listSection}>
        <AudioOutputList />
      </div>
      <div className={classes.listSection}>
        <VideoInputList />
      </div>
    </DialogContent>
  );
}
