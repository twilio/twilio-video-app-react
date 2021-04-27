import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

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

export default function EndCallButton(props: { className?: string }) {
  const classes = useStyles();
  const { room } = useVideoContext();

  const disconnect = () => {
    room!.disconnect();
    setTimeout(() => {
      window.location.href = `${window.location.protocol}//${window.location.host}`;
    }, 500);
  };

  return (
    <Button onClick={() => disconnect()} className={clsx(classes.button, props.className)} data-cy-disconnect>
      Sair
    </Button>
  );
}
