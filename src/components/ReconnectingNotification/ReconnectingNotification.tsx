import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import useRoomState from '../../hooks/useRoomState/useRoomState';

export default function ReconnectingNotification() {
  const roomState = useRoomState();
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      message="Reconnecting&hellip;"
      open={roomState === 'reconnecting'}
    />
  );
}
