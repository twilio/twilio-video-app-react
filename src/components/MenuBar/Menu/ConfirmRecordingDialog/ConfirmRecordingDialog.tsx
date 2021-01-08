import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

type ConfirmRecordingDialogProps = {
  open: boolean;
  handleClose: () => void;
  handleContinue: () => void;
};

export default function ConfirmRecordingDialog({ open, handleClose, handleContinue }: ConfirmRecordingDialogProps) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Start Recording</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This action will result in all participants' audio and video being recorded. This feature is intended for
          testing and development purposes only.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleContinue} color="primary">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
