import React from 'react';
import { styled } from '@material-ui/core/styles';

import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import IconButton from '@material-ui/core/IconButton';

import useFullScreenToggler from '../../hooks/useFullScreenToggler/useFullScreenToggler';

const FullscreeButton = styled(IconButton)({
  marginLeft: 'auto',
});

export default function ToggleFullscreenButton() {
  const [isFullScreen, toggleFullScreen] = useFullScreenToggler();

  return (
    <FullscreeButton aria-label={`full screen`} onClick={toggleFullScreen}>
      {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </FullscreeButton>
  );
}
