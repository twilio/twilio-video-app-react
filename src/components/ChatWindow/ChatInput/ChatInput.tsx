import React, { useRef, useState } from 'react';
import SendMessageIcon from '../../../icons/SendMessageIcon';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { Button, Grid, makeStyles, Theme, useMediaQuery } from '@material-ui/core';
import { Conversation } from '@twilio/conversations/lib/conversation';
import FileAttachmentIcon from '../../../icons/FileAttachmentIcon';

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
    margin: '1em 0 0 1em',
    padding: '0.56em',
    minWidth: 'auto',
    '&:disabled': {
      background: 'none',
    },
  },
});

interface ChatInputProps {
  conversation: Conversation;
}

export default function ChatInput({ conversation }: ChatInputProps) {
  const classes = useStyles();
  const [messageBody, setMessageBody] = useState('');
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
    if (event.target.files) {
      const file = event.target.files[0];
      var formData = new FormData();
      formData.append('userfile', file);
      conversation.sendMessage(formData);
    }
  };

  return (
    <div className={classes.chatInputContainer}>
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
      <Grid container justify="flex-end">
        <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleSendFile} />
        <Button className={classes.button} onClick={() => fileInputRef.current?.click()}>
          <FileAttachmentIcon />
        </Button>

        <Button
          className={classes.button}
          onClick={() => handleSendMessage(messageBody)}
          color="primary"
          variant="contained"
          disabled={!isValidMessage}
        >
          <SendMessageIcon />
        </Button>
      </Grid>
    </div>
  );
}
