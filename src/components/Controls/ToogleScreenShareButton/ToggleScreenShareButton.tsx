import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import ScreenShare from '@material-ui/icons/ScreenShare';
import StopScreenShare from '@material-ui/icons/StopScreenShare';
import Tooltip from '@material-ui/core/Tooltip';

import useScreenShareToggle from '../../../hooks/useScreenShareToggle/useScreenShareToggle';
import useScreenShareParticipant from '../../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
      '&[disabled]': {
        color: 'rgba(225, 225, 225, 0.8)',
        backgroundColor: 'rgba(175, 175, 175, 0.6);',
      },
    },
  })
);

export default function ToggleScreenShareButton(props: { disabled?: boolean }) {
  const classes = useStyles();
  const [isScreenShared, toggleScreenShare] = useScreenShareToggle();
  const screenShareParticipant = useScreenShareParticipant();
  const { room } = useVideoContext();
  const disableScreenShareButton = screenShareParticipant && screenShareParticipant !== room.localParticipant;
  const screenShareIsSupported = navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia;
  const isDisabled = props.disabled || disableScreenShareButton || !screenShareIsSupported;

  let tooltipMessage = 'Share Screen';

  if (isScreenShared) {
    tooltipMessage = 'Stop Sharing Screen';
  }

  if (disableScreenShareButton) {
    tooltipMessage = 'Cannot share screen when another user is sharing';
  }

  if (!screenShareIsSupported) {
    tooltipMessage = 'Screen sharing is not supported with this browser';
  }

  return (
    <Tooltip
      title={tooltipMessage}
      placement="top"
      PopperProps={{ disablePortal: true }}
      style={{ cursor: isDisabled ? 'not-allowed' : '' }}
    >
      <div>
        {/* The div element is needed because a disabled button will not emit hover events and we want to display
          a tooltip when screen sharing is disabled */}
        <Fab className={classes.fab} onClick={toggleScreenShare} disabled={isDisabled}>
          {isScreenShared ? <StopScreenShare /> : <ScreenShare />}
        </Fab>
      </div>
    </Tooltip>
  );
}
