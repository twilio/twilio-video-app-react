import React from 'react';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { useAppState } from '../../../state';

export default function FinishAppointmentButton() {
  const { user, appointmentID } = useAppState();

  const finishAppointment = () => {
    if (window.confirm('¿Estas seguro de terminar esta sesión?')) {
      $.ajax(`/appointments/${appointmentID}`, {
        type: 'PATCH',
        data: { appointment: { completed: true } }
      })
    }
  };

  return user.userType === 'Doctor' ? (
    <Tooltip title={'Terminar consulta'} placement="bottom" PopperProps={{ disablePortal: true }}>
      <IconButton onClick={finishAppointment}>
        <ExitToAppIcon />
      </IconButton>
    </Tooltip>
  ) : null;

}
