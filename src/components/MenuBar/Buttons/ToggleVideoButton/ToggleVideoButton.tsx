import React, { useCallback, useRef } from 'react';

import Button from '@material-ui/core/Button';
import VideoOffIcon from '../../../../icons/VideoOffIcon';
import VideoOnIcon from '../../../../icons/VideoOnIcon';

import useLocalVideoToggle from '../../../../hooks/useLocalVideoToggle/useLocalVideoToggle';

export default function ToggleVideoButton(props: { disabled?: boolean; className?: string }) {
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const lastClickTimeRef = useRef(0);

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 200) {
      lastClickTimeRef.current = Date.now();
      toggleVideoEnabled();
    }
  }, [toggleVideoEnabled]);

  return (
    <Button
      className={props.className}
      onClick={toggleVideo}
      disabled={props.disabled}
      startIcon={isVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}
    >
      {isVideoEnabled ? 'Stop Video' : 'Start Video'}
    </Button>
  );
}
