import React from 'react';
import Snackbar from '../Snackbar/Snackbar';
import useRoomState from '../../hooks/useRoomState/useRoomState';

export default function ReconnectingNotification() {
  const roomState = useRoomState();

  return (
    <Snackbar
      variant="error"
      headline="Conexion perdida:"
      message="Reconectando"
      open={roomState === 'reconnecting'}
    />
  );
}
