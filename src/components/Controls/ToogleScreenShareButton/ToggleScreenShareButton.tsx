import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import ScreenShare from '@material-ui/icons/ScreenShare';
import StopScreenShare from '@material-ui/icons/StopScreenShare';
import Tooltip from '@material-ui/core/Tooltip';

import useScreenShareToggle from '../../../hooks/useScreenShareToggle/useScreenShareToggle';
import useScreenShareParticipant from '../../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import { useVideoContext } from '../../../hooks/context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  })
);

export default function ToggleScreenShareButton() {
  const classes = useStyles();
  const [isScreenShared, toggleScreenShare] = useScreenShareToggle();
  const screenShareParticipant = useScreenShareParticipant();
  const { room } = useVideoContext();
  const disableScreenShareButton = screenShareParticipant && screenShareParticipant !== room.localParticipant;

  return (
    navigator.mediaDevices &&
    navigator.mediaDevices.getDisplayMedia && (
      <Tooltip
        title={isScreenShared ? 'Stop Screen Sharing' : 'Share Screen'}
        placement="top"
        PopperProps={{ disablePortal: true }}
      >
        <Fab className={classes.fab} onClick={toggleScreenShare} disabled={disableScreenShareButton}>
          {isScreenShared ? <StopScreenShare /> : <ScreenShare />}
        </Fab>
      </Tooltip>
    )
  );
}
