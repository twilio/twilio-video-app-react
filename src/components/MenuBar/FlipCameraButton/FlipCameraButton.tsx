import React, { useCallback, useEffect, useState } from 'react';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import { IconButton } from '@material-ui/core';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { LocalVideoTrack } from 'twilio-video';

export default function FlipCameraButton() {
  const { localTracks } = useVideoContext();
  const [supportsFacingMode, setSupportsFacingMode] = useState<Boolean | null>(null);
  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;

  useEffect(() => {
    const handleStarted = (track: LocalVideoTrack) => {
      // The 'supportsFacingMode' variable determines if this component is rendered
      // If 'facingMode' exists, we will set supportsFacingMode to true.
      // However, if facingMode is ever undefined again (when the user unpublishes video), we
      // won't set 'supportsFacingMode' to false. This prevents the icon from briefly
      // disappearing when the user switches their front/rear camera.
      const currentFacingMode = track.mediaStreamTrack.getSettings().facingMode;
      if (currentFacingMode && supportsFacingMode === null) {
        setSupportsFacingMode(true);
      }
    };
    videoTrack?.on('started', handleStarted);
    return () => {
      videoTrack?.on('started', handleStarted);
    };
  }, [videoTrack, supportsFacingMode]);

  const toggleFacingMode = useCallback(() => {
    const constraints = videoTrack.mediaStreamTrack.getSettings();
    delete constraints.deviceId;
    const newFacingMode = constraints.facingMode === 'user' ? 'environment' : 'user';
    console.log(newFacingMode, constraints);
    videoTrack.restart({ ...constraints, facingMode: newFacingMode });
  }, [videoTrack]);

  return supportsFacingMode ? (
    <IconButton onClick={toggleFacingMode} disabled={!videoTrack}>
      <FlipCameraIosIcon />
    </IconButton>
  ) : null;
}
