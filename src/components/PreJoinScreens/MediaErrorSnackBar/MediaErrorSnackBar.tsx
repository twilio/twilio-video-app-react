import React, { useState } from 'react';
import SnackBar from '../../SnackBar/SnackBar';
import { useAudioInputDevices, useVideoInputDevices } from '../../MenuBar/DeviceSelector/deviceHooks/deviceHooks';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export default function MediaErrorSnackBar({ error }: { error?: Error }) {
  const audioDevices = useAudioInputDevices();
  const videoDevices = useVideoInputDevices();

  const hasAudio = audioDevices.length > 0;
  const hasVideo = videoDevices.length > 0;

  const { isAcquiringLocalTracks } = useVideoContext();

  const [isSnackBarDismissed, setIsSnackBarDismissed] = useState(false);

  const isSnackBarOpen = !isSnackBarDismissed && !isAcquiringLocalTracks && (Boolean(error) || !hasVideo || !hasVideo);

  let headline = '';
  let message = '';
  let variant: 'error' | 'warning' = 'warning';

  if (error) {
    headline = 'Something Happened:';
    message = "But I don't know what!";
    variant = 'error';
  }

  if (!hasAudio && !hasVideo) {
    headline = 'Something Happened:';
    message = 'no audio or video';
    variant = 'warning';
  }

  if (!hasAudio) {
    headline = 'Something Happened:';
    message = 'no audio';
    variant = 'warning';
  }

  if (!hasVideo) {
    headline = 'Something Happened:';
    message = 'no video';
    variant = 'warning';
  }

  return (
    <SnackBar
      open={isSnackBarOpen}
      handleClose={() => setIsSnackBarDismissed(true)}
      headline={headline}
      message={message}
      variant={variant}
    />
  );
}
