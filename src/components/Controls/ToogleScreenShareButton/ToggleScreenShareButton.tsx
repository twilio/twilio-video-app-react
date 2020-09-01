import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import ScreenShareIcon from './ScreenShareIcon';
import Tooltip from '@material-ui/core/Tooltip';

import useScreenShareParticipant from '../../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export const SCREEN_SHARE_TEXT = 'Share Screen';
export const STOP_SCREEN_SHARE_TEXT = 'Stop Sharing Screen';
export const SHARE_IN_PROGRESS_TEXT = 'Cannot share screen when another user is sharing';
export const SHARE_NOT_SUPPORTED_TEXT = 'Screen sharing is not supported with this browser';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
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
  const screenShareParticipant = useScreenShareParticipant();
  const { room, toggleScreenShare } = useVideoContext();
  const disableScreenShareButton = screenShareParticipant && screenShareParticipant !== room.localParticipant;
  const isScreenShareSupported = navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia;
  const isDisabled = props.disabled || disableScreenShareButton || !isScreenShareSupported;

  let tooltipMessage = '';

  if (disableScreenShareButton) {
    tooltipMessage = SHARE_IN_PROGRESS_TEXT;
  }

  if (!isScreenShareSupported) {
    tooltipMessage = SHARE_NOT_SUPPORTED_TEXT;
  }

  return (
    <Tooltip
      title={tooltipMessage}
      placement="top"
      PopperProps={{ disablePortal: true }}
      style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
    >
      <span>
        {/* The span element is needed because a disabled button will not emit hover events and we want to display
          a tooltip when screen sharing is disabled */}
        <Button
          className={classes.button}
          onClick={toggleScreenShare}
          disabled={isDisabled}
          startIcon={<ScreenShareIcon />}
        >
          {SCREEN_SHARE_TEXT}
        </Button>
      </span>
    </Tooltip>
  );
}
