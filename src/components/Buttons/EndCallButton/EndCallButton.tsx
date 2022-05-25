import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

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

export default function EndCallButton(props: { className?: string }) {
  const classes = useStyles();
  const { room } = useVideoContext();

  return (
    <Button
      onClick={() => {
        room.disconnect();

        const rating = Math.floor(Math.random() * 5) as any;
        watchRTC.setUserRating(rating, Math.random() ? `User rating is ${rating}` : ``);
      }}
      className={clsx(classes.button, props.className)}
      data-cy-disconnect
    >
      Disconnect
    </Button>
  );
}
