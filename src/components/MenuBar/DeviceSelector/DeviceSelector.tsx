import React, { useState } from 'react';

import AudioInputList from './AudioInputList/AudioInputList';
import AudioOutputList from './AudioOutputList/AudioOutputList';
import { Dialog, IconButton, DialogContent, Button, Theme } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import VideoInputList from './VideoInputList/VideoInputList';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '500px',
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
      '& .inputSelect': {
        width: 'calc(100% - 35px)',
      },
    },
    listSection: {
      margin: '1em 0',
    },
    button: {
      float: 'right',
    },
  })
);

export function DeviceSelctor() {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setIsOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent className={classes.container}>
          <div className={classes.listSection}>
            <AudioInputList />
          </div>
          <div className={classes.listSection}>
            <AudioOutputList />
          </div>
          <div className={classes.listSection}>
            <VideoInputList />
          </div>
          <Button className={classes.button} onClick={() => setIsOpen(false)}>
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
