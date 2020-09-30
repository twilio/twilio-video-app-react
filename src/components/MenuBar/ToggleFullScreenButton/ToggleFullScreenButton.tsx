import React from 'react';

import FullscreenIcon from '@material-ui/icons/Fullscreen';
import fscreen from 'fscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import useFullScreenToggle from '../../../hooks/useFullScreenToggle/useFullScreenToggle';

export default function ToggleFullscreenButton() {
  const [isFullScreen, toggleFullScreen] = useFullScreenToggle();

  return fscreen.fullscreenEnabled ? (
    <Tooltip title={isFullScreen ? 'Quitar pantalla completa' : 'Pantalla completa' }
             placement="bottom"
             PopperProps={{ disablePortal: true }}>
      <IconButton aria-label={`full screen`} onClick={toggleFullScreen}>
        {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
    </Tooltip>
  ) : null;
}
