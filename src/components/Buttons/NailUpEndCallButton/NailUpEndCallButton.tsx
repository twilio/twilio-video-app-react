import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

import watchRTC from '@testrtc/watchrtc-sdk';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: '#600101',
      },
    },
  })
);

export default function NailUpEndCallButton(props: { className?: string }) {
  const classes = useStyles();

  return (
    <Button
      onClick={() => {
        watchRTC.persistentEnd(true);
      }}
      className={clsx(classes.button, props.className)}
      data-cy-disconnect
      style={{ margin: '0 10px' }}
    >
      Nail Up Disconnect
    </Button>
  );
}
