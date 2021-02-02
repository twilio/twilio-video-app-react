import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { DEFAULT_VIDEO_CONSTRAINTS } from '../../../constants';
import FlipCameraIcon from './FlipCameraIcon';
import { LocalVideoTrack } from 'twilio-video';
import useDevices from '../../../hooks/useDevices/useDevices';
import useMediaStreamTrack from '../../../hooks/useMediaStreamTrack/useMediaStreamTrack';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export default function FlipCameraButton() {
  const { localTracks } = useVideoContext();
  const [supportsFacingMode, setSupportsFacingMode] = useState<Boolean | null>(null);
  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;
  const mediaStreamTrack = useMediaStreamTrack(videoTrack);
  const { videoInputDevices } = useDevices();

  useEffect(() => {
    // The 'supportsFacingMode' variable determines if this component is rendered
    // If 'facingMode' exists, we will set supportsFacingMode to true.
    // However, if facingMode is ever undefined again (when the user unpublishes video), we
    // won't set 'supportsFacingMode' to false. This prevents the icon from briefly
    // disappearing when the user switches their front/rear camera.
    const currentFacingMode = mediaStreamTrack?.getSettings().facingMode;
    if (currentFacingMode && supportsFacingMode === null) {
      setSupportsFacingMode(true);
    }
  }, [mediaStreamTrack, supportsFacingMode]);

  const toggleFacingMode = useCallback(() => {
    const newFacingMode = mediaStreamTrack?.getSettings().facingMode === 'user' ? 'environment' : 'user';
    videoTrack.restart({
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      facingMode: newFacingMode,
    });
  }, [mediaStreamTrack, videoTrack]);

  return supportsFacingMode && videoInputDevices.length > 1 ? (
    <Button onClick={toggleFacingMode} disabled={!videoTrack} startIcon={<FlipCameraIcon />}>
      Flip Camera
    </Button>
  ) : null;
}
