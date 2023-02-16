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

export default function NailUpJoinCallButton(props: { className?: string }) {
  const classes = useStyles();
  const { room } = useVideoContext();

  return (
    <Button
      onClick={() => {
        watchRTC.persistentStart(
          `${room.name.split(',')[0]}:${Math.floor(Math.random() * 10000)}`,
          room.localParticipant.identity
        );
      }}
      className={clsx(classes.button, props.className)}
      data-cy-disconnect
    >
      Nail Up Join
    </Button>
  );
}
