import React from 'react';
import { styled } from '@material-ui/core/styles';

import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import IconButton from '@material-ui/core/IconButton';

import useFullScreenToggle from '../../hooks/useFullScreenToggle/useFullScreenToggle';

const FullscreenButton = styled(IconButton)({
  marginLeft: 'auto',
});

export default function ToggleFullscreenButton() {
  const [isFullScreen, toggleFullScreen] = useFullScreenToggle();

  return (
    <FullscreenButton aria-label={`full screen`} onClick={toggleFullScreen}>
      {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </FullscreenButton>
  );
}
