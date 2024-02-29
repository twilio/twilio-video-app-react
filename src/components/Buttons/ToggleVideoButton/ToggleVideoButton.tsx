import React, { useCallback, useRef } from 'react';

import watchRTC from '@testrtc/watchrtc-sdk';

import Button from '@material-ui/core/Button';
import VideoOffIcon from '../../../icons/VideoOffIcon';
import VideoOnIcon from '../../../icons/VideoOnIcon';

import { useHasVideoInputDevices } from '../../../hooks/deviceHooks/deviceHooks';
import useLocalVideoToggle from '../../../hooks/useLocalVideoToggle/useLocalVideoToggle';

export default function ToggleVideoButton(props: { disabled?: boolean; className?: string }) {
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const lastClickTimeRef = useRef(0);
  const hasVideoDevices = useHasVideoInputDevices();

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 500) {
      lastClickTimeRef.current = Date.now();
      toggleVideoEnabled();

      watchRTC.addEvent({
        type: 'local',
        name: isVideoEnabled ? 'Stop Video' : 'Start Video',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleVideoEnabled]);

  return (
    <Button
      className={props.className}
      onClick={toggleVideo}
      disabled={!hasVideoDevices || props.disabled}
      startIcon={isVideoEnabled ? <VideoOnIcon /> : <VideoOffIcon />}
    >
      {!hasVideoDevices ? 'No Video' : isVideoEnabled ? 'Stop Video' : 'Start Video'}
    </Button>
  );
}
