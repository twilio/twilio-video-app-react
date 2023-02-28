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

const getIterator = () => {
  const iterator = (window as any).nailupIterator;
  if (!iterator) {
    (window as any).nailupIterator = 1;
    return 1;
  } else {
    const newIterator = (window as any).nailupIterator + 1;
    (window as any).nailupIterator = newIterator;
    return newIterator;
  }
};

export default function NailUpJoinCallButton(props: { className?: string }) {
  const classes = useStyles();
  const { room } = useVideoContext();

  const onJoinClick = () => {
    const url = new URL((window as any).location);

    const newRoomId = `${room.name.split(',')[0]}-${getIterator()}`;
    const newpathName = `/room/${newRoomId}`;
    url.pathname = newpathName;
    window.history.pushState({}, '', url.toString());

    watchRTC.persistentStart(newRoomId, room.localParticipant.identity);
  };

  return (
    <Button onClick={onJoinClick} className={clsx(classes.button, props.className)} data-cy-disconnect>
      Nail Up Join
    </Button>
  );
}
