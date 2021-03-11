import React, { useState } from 'react';
import SendMessageIcon from '../../../icons/SendMessageIcon';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { makeStyles, Theme, useMediaQuery } from '@material-ui/core';
import { Conversation } from '@twilio/conversations/lib/conversation';

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
  sendButton: {
    height: '40px',
    width: '40px',
    border: '0',
    borderRadius: '4px',
    float: 'right',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1em',
    background: '#0263E0',
    cursor: 'pointer',
    '&:disabled': {
      background: 'none',
      cursor: 'default',
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

      <button className={classes.sendButton} onClick={() => handleSendMessage(messageBody)} disabled={!isValidMessage}>
        <SendMessageIcon />
      </button>
    </div>
  );
}
