import React, { useRef, useState } from 'react';
import { Button, CircularProgress, Grid, makeStyles, Theme, useMediaQuery } from '@material-ui/core';
import { Conversation } from '@twilio/conversations/lib/conversation';
import FileAttachmentIcon from '../../../icons/FileAttachmentIcon';
import SendMessageIcon from '../../../icons/SendMessageIcon';
import Snackbar from '../../Snackbar/Snackbar';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const useStyles = makeStyles({
  chatInputContainer: {
    borderTop: '1px solid #e4e7e9',
    borderBottom: '1px solid #e4e7e9',
    padding: '1em 1.2em 1em',
  },
  textArea: {
    padding: '0.75em 1em',
    marginTop: '0.4em',
    width: '100%',
    border: '0',
    resize: 'none',
    fontSize: '14px',
    fontFamily: 'Inter',
  },
  button: {
    padding: '0.56em',
    minWidth: 'auto',
    '&:disabled': {
      background: 'none',
      '& path': {
        fill: '#d8d8d8',
      },
    },
  },
  buttonContainer: {
    margin: '1em 0 0 1em',
    display: 'flex',
  },
  fileButtonContainer: {
    position: 'relative',
    marginRight: '1em',
  },
  fileButtonLoadingSpinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

interface ChatInputProps {
  conversation: Conversation;
}

export default function ChatInput({ conversation }: ChatInputProps) {
  const classes = useStyles();
  const [messageBody, setMessageBody] = useState('');
  const [isSendingFile, setIsSendingFile] = useState(false);
  const [isSendingFileError, setIsSendingFileError] = useState<string | null>(null);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isValidMessage = /\S/.test(messageBody);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageBody(event.target.value);
  };

  // ensures pressing enter + shift creates a new line, so that enter on its own only sends the message:
  const handleReturnKeyPress = (event: React.KeyboardEvent) => {
    if (!isMobile && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(messageBody);
    }
  };

  const handleSendMessage = (message: string) => {
    if (isValidMessage) {
      conversation.sendMessage(message.trim());
      setMessageBody('');
    }
  };

  const handleSendFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      var formData = new FormData();
      formData.append('userfile', file);
      setIsSendingFile(true);
      setIsSendingFileError(null);
      conversation
        .sendMessage(formData)
        .catch(e => {
          if (e.code === 413) {
            setIsSendingFileError('File size is too large. Maxiumim size is 150MB. Please try again.');
          } else {
            setIsSendingFileError('There was a problem uploading the file. Please try again.');
          }
          console.error(e);
          //@ts-ignore
          window.e = e;
        })
        .finally(() => setIsSendingFile(false));
    }
  };

  return (
    <div className={classes.chatInputContainer}>
      <Snackbar
        open={Boolean(isSendingFileError)}
        headline="Error"
        message={isSendingFileError || ''}
        variant="error"
        handleClose={() => setIsSendingFileError(null)}
      />

      <TextareaAutosize
        rowsMin={1}
        rowsMax={3}
        className={classes.textArea}
        aria-label="chat input"
        placeholder="Write a message..."
        autoFocus
        onKeyPress={handleReturnKeyPress}
        onChange={handleChange}
        value={messageBody}
      />

      <Grid container alignItems="flex-end" justify="flex-end" wrap="nowrap">
        <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleSendFile} />
        <div className={classes.buttonContainer}>
          <div className={classes.fileButtonContainer}>
            <Button className={classes.button} onClick={() => fileInputRef.current?.click()} disabled={isSendingFile}>
              <FileAttachmentIcon />
            </Button>

            {isSendingFile && <CircularProgress size={24} className={classes.fileButtonLoadingSpinner} />}
          </div>

          <Button
            className={classes.button}
            onClick={() => handleSendMessage(messageBody)}
            color="primary"
            variant="contained"
            disabled={!isValidMessage}
          >
            <SendMessageIcon />
          </Button>
        </div>
      </Grid>
    </div>
  );
}
