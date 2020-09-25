import React, { useState } from 'react';
import Snackbar from '../../Snackbar/Snackbar';
import { useHasAudioInputDevices, useHasVideoInputDevices } from '../../../hooks/deviceHooks/deviceHooks';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export function getSnackbarContent(hasAudio: boolean, hasVideo: boolean, error?: Error) {
  let headline = '';
  let message = '';

  switch (true) {
    // This error is emitted when the user or the user's system has denied permission to use the media devices
    case error?.name === 'NotAllowedError':
      headline = 'Unable to Access Media:';

      if (error!.message === 'Permission denied by system') {
        // Chrome only
        message =
          'The operating system has blocked the browser from accessing the microphone or camera. Please check your operating system settings.';
      } else {
        message =
          'The user has denied permission to use audio and video. Please grant permission to the browser to access the microphone and camera.';
      }

      break;

    // This error is emitted when input devices are not connected or disabled in the OS settings
    case error?.name === 'NotFoundError':
      headline = 'Cannot Find Microphone or Camera:';
      message =
        'The browser cannot access the microphone or camera. Please make sure all input devices are connected and enabled.';
      break;

    // Other getUserMedia errors are less likely to happen in this app. Here we will display
    // the system's error message directly to the user.
    case Boolean(error):
      headline = 'Error Acquiring Media:';
      message = `${error!.name} ${error!.message}`;
      break;

    case !hasAudio && !hasVideo:
      headline = 'No Camera or Microphone Detected:';
      message = 'Other participants in the room will be unable to see and hear you.';
      break;

    case !hasVideo:
      headline = 'No Camera Detected:';
      message = 'Other participants in the room will be unable to see you.';
      break;

    case !hasAudio:
      headline = 'No Microphone Detected:';
      message = 'Other participants in the room will be unable to hear you.';
  }

  return {
    headline,
    message,
  };
}

export default function MediaErrorSnackbar({ error }: { error?: Error }) {
  const hasAudio = useHasAudioInputDevices();
  const hasVideo = useHasVideoInputDevices();

  const { isAcquiringLocalTracks } = useVideoContext();

  const [isSnackbarDismissed, setIsSnackbarDismissed] = useState(false);

  const isSnackbarOpen = !isSnackbarDismissed && !isAcquiringLocalTracks && (Boolean(error) || !hasAudio || !hasVideo);

  const { headline, message } = getSnackbarContent(hasAudio, hasVideo, error);

  return (
    <Snackbar
      open={isSnackbarOpen}
      handleClose={() => setIsSnackbarDismissed(true)}
      headline={headline}
      message={message}
      variant="warning"
    />
  );
}
