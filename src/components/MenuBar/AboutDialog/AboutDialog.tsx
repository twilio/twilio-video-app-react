import React, { PropsWithChildren } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// import { version as appVersion } from '../../../../../../../../package.json';
import Video from 'twilio-video';
import { useAppState } from '../../../state';

interface AboutDialogProps {
  open: boolean;
  onClose(): void;
}

function AboutDialog({ open, onClose }: PropsWithChildren<AboutDialogProps>) {
  const { roomType } = useAppState();
  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="xs">
      <DialogTitle>About:</DialogTitle>
      <DialogContent>
        <DialogContentText>Navegador soportado: {String(Video.isSupported)}</DialogContentText>
        <DialogContentText>SDK Version: {Video.version}</DialogContentText>
        <DialogContentText>www.tranquilamente.co</DialogContentText>
        {roomType && <DialogContentText>Room Type: {roomType}</DialogContentText>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AboutDialog;
