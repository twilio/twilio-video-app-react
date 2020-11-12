import React, { PropsWithChildren } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles } from '@material-ui/core/styles';

interface WaitingForRoomDialogProps {
  cancelWait: Function;
  waitingNotification: string | null;
}

const useStyles = makeStyles(theme =>
  createStyles({
    loadingSpinner: {
      marginLeft: '3em',
    },
  })
);

function WaitingForRoomDialog({ cancelWait, waitingNotification }: PropsWithChildren<WaitingForRoomDialogProps>) {
  const classes = useStyles();
  const message = waitingNotification;

  return (
    <Dialog open={waitingNotification !== null} onClose={() => cancelWait()} fullWidth={true} maxWidth="xs">
      <DialogTitle>Conference Not Started</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <CircularProgress className={classes.loadingSpinner} />
      <DialogActions>
        <Button onClick={() => cancelWait()} color="primary" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default WaitingForRoomDialog;
