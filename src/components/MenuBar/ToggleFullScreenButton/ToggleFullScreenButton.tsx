import React from 'react';

import FullscreenIcon from '@material-ui/icons/Fullscreen';
import fscreen from 'fscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import IconButton from '@material-ui/core/IconButton';

import useFullScreenToggle from '../../../hooks/useFullScreenToggle/useFullScreenToggle';

export default function ToggleFullscreenButton() {
  const [isFullScreen, toggleFullScreen] = useFullScreenToggle();

  return fscreen.fullscreenEnabled ? (
    <IconButton aria-label={`full screen`} onClick={toggleFullScreen}>
      {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </IconButton>
  ) : null;
}
