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

export default function ConnectWSButton(props: { className?: string }) {
  const classes = useStyles();

  return (
    <Button
      onClick={() => {
        watchRTC.connect();
      }}
      className={clsx(classes.button, props.className)}
      data-cy-disconnect
      style={{ margin: '0 10px' }}
    >
      Connect WS
    </Button>
  );
}
