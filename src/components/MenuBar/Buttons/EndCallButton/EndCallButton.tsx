import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';

import useVideoContext from '../../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: '#600101',
      },
    },
  })
);

export default function EndCallButton() {
  const classes = useStyles();
  const { room } = useVideoContext();

  return (
    <Button onClick={() => room.disconnect()} className={classes.button}>
      Disconnect
    </Button>
  );
}
