import React from 'react';

import AudioInputList from './AudioInputList/AudioInputList';
import AudioOutputList from './AudioOutputList/AudioOutputList';
import { DialogContent, Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import VideoInputList from './VideoInputList/VideoInputList';

const useStyles = makeStyles({
  headline: {
    marginBottom: '1.3em',
    fontSize: '1.1rem',
  },
  listSection: {
    margin: '2em 0 0',
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
        <Typography variant="h6" className={classes.headline}>
          Video
        </Typography>
        <VideoInputList />
      </div>
      <Divider />
      <div className={classes.listSection}>
        <Typography variant="h6" className={classes.headline}>
          Audio
        </Typography>
        <AudioInputList />
      </div>
      <div className={classes.listSection}>
        <AudioOutputList />
      </div>
    </DialogContent>
  );
}
