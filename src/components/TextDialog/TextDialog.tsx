import React, { PropsWithChildren } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';

interface TextDialogProps {
  open: boolean;
  onClose(): void;
  text: string | string[];
  title?: string;
}

/**
 * テキスト(string or string[])を表示させるDialog
 * **/

function TextDialog({ open, onClose, text, title }: PropsWithChildren<TextDialogProps>) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="xs">
      {title && <DialogTitle>{title}</DialogTitle>}
      <Divider />
      <DialogContent>
        {text instanceof Array ? (
          text.map((t, i) => <DialogContentText key={t}>{t}</DialogContentText>)
        ) : (
          <DialogContentText>{text}</DialogContentText>
        )}
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TextDialog;
