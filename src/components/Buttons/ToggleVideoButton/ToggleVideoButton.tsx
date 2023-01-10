import React, { useCallback, useRef } from 'react';

import Button from '@material-ui/core/Button';
import VideoMutedIcon from '../../../icons/VideoMutedIcon';
import VideoOffIcon from '../../../icons/VideoOffIcon';
import VideoOnIcon from '../../../icons/VideoOnIcon';

import useDevices from '../../../hooks/useDevices/useDevices';
import useLocalVideoToggle from '../../../hooks/useLocalVideoToggle/useLocalVideoToggle';

export default function ToggleVideoButton(props: { disabled?: boolean; className?: string; isVideoMuted?: boolean }) {
  const { className, disabled, isVideoMuted } = props;
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const lastClickTimeRef = useRef(0);
  const { hasVideoInputDevices } = useDevices();

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 500) {
      lastClickTimeRef.current = Date.now();
      toggleVideoEnabled();
    }
  }, [toggleVideoEnabled]);

  return (
    <Button
      className={className}
      onClick={toggleVideo}
      disabled={!hasVideoInputDevices || isVideoMuted || disabled}
      startIcon={
        isVideoEnabled && !isVideoMuted ? <VideoOnIcon /> : isVideoMuted ? <VideoMutedIcon /> : <VideoOffIcon />
      }
    >
      {!hasVideoInputDevices
        ? 'No Video'
        : isVideoEnabled && !isVideoMuted
        ? 'Stop Video'
        : isVideoMuted
        ? 'Video Lost'
        : 'Start Video'}
    </Button>
  );
}
