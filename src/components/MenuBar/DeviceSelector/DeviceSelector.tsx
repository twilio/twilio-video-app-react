import React from 'react';

import AudioInputList from './AudioInputList/AudioInputList';
import AudioOutputList from './AudioOutputList/AudioOutputList';
import { DialogContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import VideoInputList from './VideoInputList/VideoInputList';

const useStyles = makeStyles({
  listSection: {
    '&:not(:first-child)': {
      margin: '2em 0',
    },
  },
});

export function DeviceSelector() {
  const classes = useStyles();

  return (
    <DialogContent>
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
