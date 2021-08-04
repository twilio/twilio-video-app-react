import React, { useState } from 'react';
import Snackbar from '../../Snackbar/Snackbar';
import useDevices from '../../../hooks/useDevices/useDevices';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import notAllowedMessages from './../../ErrorDialog/ErrorMessages/notAllowedMessages'

export function getSnackbarContent(hasAudio: boolean, hasVideo: boolean, error?: Error) {
  let headline = '';
  let message = '';

  switch (true) {
    // These custom errors are thrown by the useLocalTracks hook. They are thrown when the user explicitly denies
    // permission to only their camera, or only their microphone.
    case error?.message === 'CameraPermissionsDenied':
      headline = 'Debes permitirnos el acceso a tu cámara y micrófono desde el navegador:';
      message = notAllowedMessages();
      break;
    case error?.message === 'MicrophonePermissionsDenied':
      headline = 'Debes permitirnos el acceso a tu cámara y micrófono desde el navegador:';
      message = notAllowedMessages();
      break;

    // This error is emitted when the user or the user's system has denied permission to use the media devices
    case error?.name === 'NotAllowedError':
      headline = 'Debes permitirnos el acceso a tu cámara y micrófono desde el navegador';

      if (error!.message === 'Permission denied by system') {
        // Chrome only
        message =
          'El sistema operativo ha bloqueado el acceso del navegador al micrófono o a la cámara. Por favor, comprueba la configuración de tu sistema operativo. Prueba reiniciando tu dispositivo e intenta de nuevo';
      } else {
        message = notAllowedMessages();
      }

      break;

    // This error is emitted when input devices are not connected or disabled in the OS settings
    case error?.name === 'NotFoundError':
      headline = 'No encontramos cámara o micrófono:';
      message =
        'El navegador no puede acceder al micrófono ni a la cámara. Asegúrese de que todos los dispositivos de entrada estén conectados y habilitados.';
      break;

    // Other getUserMedia errors are less likely to happen in this app. Here we will display
    // the system's error message directly to the user.
    case Boolean(error):
      headline = 'Error adquiriendo cámara y video:';
      message = `${error!.name} ${error!.message}`;
      break;

    case !hasAudio && !hasVideo:
      headline = 'No detectamos cámara o micrófono:';
      message = 'Otros participantes no podrán verte ni escucharte en la sala.';
      break;

    case !hasVideo:
      headline = 'No detectamos tu camera:';
      message = 'Otros participantes no podrán verte en la sala.';
      break;

    case !hasAudio:
      headline = 'No detectamos tu micrófono:';
      message = 'Otros participantes no podrán escucharte en la sala.';
  }

  return {
    headline,
    message,
  };
}

export default function MediaErrorSnackbar({ error }: { error?: Error }) {
  const { hasAudioInputDevices, hasVideoInputDevices } = useDevices();

  const { isAcquiringLocalTracks } = useVideoContext();

  const [isSnackbarDismissed, setIsSnackbarDismissed] = useState(false);

  const isSnackbarOpen =
    !isSnackbarDismissed &&
    !isAcquiringLocalTracks &&
    (Boolean(error) || !hasAudioInputDevices || !hasVideoInputDevices);

  const { headline, message } = getSnackbarContent(hasAudioInputDevices, hasVideoInputDevices, error);

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
