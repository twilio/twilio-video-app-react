import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import CallEnd from '@material-ui/icons/CallEnd';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import { receiveToken } from '../../../store/main/main';
import { useDispatch } from 'react-redux';
import { useVideoContext } from '../../../hooks/context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  })
);

export default function EndCallButton() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { room } = useVideoContext();

  const handleClick = () => {
    room.disconnect();
    dispatch(receiveToken(''));
  };

  return (
    <Tooltip title={'End Call'} onClick={handleClick} placement="top" PopperProps={{ disablePortal: true }}>
      <Fab className={classes.fab} color="primary">
        <CallEnd />
      </Fab>
    </Tooltip>
  );
}
