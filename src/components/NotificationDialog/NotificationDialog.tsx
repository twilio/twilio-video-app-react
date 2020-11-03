import React, { PropsWithChildren } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
//import enhanceMessage from './enhanceMessage';

interface NotificationDialogProps {
  dismissNotification: Function;
  notification: any | null;
}

function NotificationDialog({ dismissNotification, notification }: PropsWithChildren<NotificationDialogProps>) {
  const { message } = notification || {};

  return (
    <Dialog open={notification !== null} onClose={() => dismissNotification()} fullWidth={true} maxWidth="xs">
      <DialogTitle>Notification</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dismissNotification()} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NotificationDialog;
