import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface TranscribeDialogProps {
  open: boolean;
  onClose: () => void;
}

const TranscribeDialog: React.FC<TranscribeDialogProps> = params => {
  // 音声認識関係変数
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  return (
    <Dialog open={params.open} onClose={params.onClose} fullWidth={true} maxWidth="xs">
      <DialogTitle>Microphone : {listening ? 'on' : 'off'}</DialogTitle>
      <Divider />
      <DialogContent>
        {browserSupportsSpeechRecognition ? (
          <DialogContentText>{transcript}</DialogContentText>
        ) : (
          <DialogContentText>Browser doesn't support speech recognition.</DialogContentText>
        )}
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={() => SpeechRecognition.startListening()} color="primary" variant="contained" autoFocus>
          Start
        </Button>
        <Button onClick={() => SpeechRecognition.abortListening()} color="primary" variant="contained" autoFocus>
          End
        </Button>
        <Button onClick={resetTranscript} color="primary" variant="contained" autoFocus>
          Reset
        </Button>
        <Button onClick={params.onClose} color="primary" variant="contained" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TranscribeDialog;
