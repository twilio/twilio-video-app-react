import React from 'react';

import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import useFullScreenToggle from '../../../hooks/useFullScreenToggle/useFullScreenToggle';
export const FULL_SCREEN_TEXT = 'Enter Full Screen';
export const STOP_FULL_SCREEN_TEXT = 'Exit Full Screen';

export default function ToggleFullscreenButton() {
  const [isFullScreen, toggleFullScreen] = useFullScreenToggle();
  let tooltipMessage = FULL_SCREEN_TEXT;

  if (isFullScreen) {
    tooltipMessage = STOP_FULL_SCREEN_TEXT;
  }
  return (
    <Tooltip title={tooltipMessage} placement="top" PopperProps={{ disablePortal: true }} style={{ cursor: 'pointer' }}>
      <IconButton aria-label={`full screen`} onClick={toggleFullScreen}>
        {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
    </Tooltip>
  );
}
