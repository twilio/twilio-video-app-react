import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import CallEnd from '@material-ui/icons/CallEnd';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import useRoomState from '../../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import redirectRootPath from '../../../utils/redirectRootPath'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  })
);

const handleClick = (room, roomState) => {
  return function () {
    if (roomState === 'disconnected') {
      redirectRootPath();
    } else {
      room.disconnect();
    }
  }
};

export default function EndCallButton() {
  const classes = useStyles();
  const { room } = useVideoContext();
  const roomState = useRoomState();

  return (
    <Tooltip title={'Salir'} onClick={handleClick(room, roomState)} placement="top" PopperProps={{ disablePortal: true }}>
      <Fab className={classes.fab} color="primary">
        <CallEnd />
      </Fab>
    </Tooltip>
  );
}
