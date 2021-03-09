import React, { useState } from 'react';
import clsx from 'clsx';
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
    outline: 'none',
    paddingTop: '0.2em',
    width: '100%',
    border: '0',
    resize: 'none',
    fontSize: '14px',
    fontFamily: 'Inter',
  },
  sendButton: {
    height: '40px',
    width: '40px',
    borderRadius: '4px',
    float: 'right',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1em',
  },
  activeSendButton: {
    background: '#0263E0',
    cursor: 'pointer',
  },
});

interface InputFieldProps {
  conversation: Conversation;
}

export default function InputField({ conversation }: InputFieldProps) {
  const classes = useStyles();
  const [messageBody, setMessageBody] = useState('');
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isValidMessage = /\S/.test(messageBody);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageBody(event.target.value);
  };

  // ensures pressing enter + shift creates a new line, so that enter on its own sends the message:
  const handleReturnKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
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
        aria-label="maximum height"
        placeholder="Write a message..."
        autoFocus
        onKeyPress={isMobile ? () => null : event => handleReturnKeyPress(event)}
        onChange={event => handleChange(event)}
        value={messageBody}
      />

      <div
        className={clsx(classes.sendButton, { [classes.activeSendButton]: isValidMessage })}
        onClick={() => handleSendMessage(messageBody)}
      >
        <SendMessageIcon />
      </div>
    </div>
  );
}
