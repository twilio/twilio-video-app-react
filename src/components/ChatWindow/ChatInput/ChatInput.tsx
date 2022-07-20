import React, { useEffect, useRef, useState } from 'react';
import { Button, CircularProgress, Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { Conversation } from '@twilio/conversations';
import FileAttachmentIcon from '../../../icons/FileAttachmentIcon';
import { isMobile } from '../../../utils';
import SendMessageIcon from '../../../icons/SendMessageIcon';
import Snackbar from '../../Snackbar/Snackbar';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const useStyles = makeStyles(theme => ({
  chatInputContainer: {
    borderTop: '1px solid #e4e7e9',
    borderBottom: '1px solid #e4e7e9',
    padding: '1em 1.2em 1em',
  },
  textArea: {
    width: '100%',
    border: '0',
    resize: 'none',
    fontSize: '14px',
    fontFamily: 'Inter',
    outline: 'none',
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
  textAreaContainer: {
    display: 'flex',
    marginTop: '0.4em',
    padding: '0.48em 0.7em',
    border: '2px solid transparent',
  },
  isTextareaFocused: {
    borderColor: theme.palette.primary.main,
    borderRadius: '4px',
  },
}));

interface ChatInputProps {
  conversation: Conversation;
  isChatWindowOpen: boolean;
}

const ALLOWED_FILE_TYPES =
  'audio/*, image/*, text/*, video/*, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document .xslx, .ppt, .pdf, .key, .svg, .csv';

export default function ChatInput({ conversation, isChatWindowOpen }: ChatInputProps) {
  const classes = useStyles();
  const [messageBody, setMessageBody] = useState('');
  const [isSendingFile, setIsSendingFile] = useState(false);
  const [fileSendError, setFileSendError] = useState<string | null>(null);
  const isValidMessage = /\S/.test(messageBody);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  useEffect(() => {
    if (isChatWindowOpen) {
      // When the chat window is opened, we will focus on the text input.
      // This is so the user doesn't have to click on it to begin typing a message.
      textInputRef.current?.focus();
    }
  }, [isChatWindowOpen]);

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
      setFileSendError(null);
      conversation
        .sendMessage(formData)
        .catch((e: Error) => {
          if (e.code === 413) {
            setFileSendError('File size is too large. Maximum file size is 150MB.');
          } else {
            setFileSendError('There was a problem uploading the file. Please try again.');
          }
          console.log('Problem sending file: ', e);
        })
        .finally(() => {
          setIsSendingFile(false);
        });
    }
  };

  return (
    <div className={classes.chatInputContainer}>
      <Snackbar
        open={Boolean(fileSendError)}
        headline="Error"
        message={fileSendError || ''}
        variant="error"
        handleClose={() => setFileSendError(null)}
      />
      <div className={clsx(classes.textAreaContainer, { [classes.isTextareaFocused]: isTextareaFocused })}>
        {/* 
        Here we add the "isTextareaFocused" class when the user is focused on the TextareaAutosize component.
        This helps to ensure a consistent appearance across all browsers. Adding padding to the TextareaAutosize
        component does not work well in Firefox. See: https://github.com/twilio/twilio-video-app-react/issues/498
        */}
        <TextareaAutosize
          minRows={1}
          maxRows={3}
          className={classes.textArea}
          aria-label="chat input"
          placeholder="Write a message..."
          onKeyPress={handleReturnKeyPress}
          onChange={handleChange}
          value={messageBody}
          data-cy-chat-input
          ref={textInputRef}
          onFocus={() => setIsTextareaFocused(true)}
          onBlur={() => setIsTextareaFocused(false)}
        />
      </div>

      <Grid container alignItems="flex-end" justifyContent="flex-end" wrap="nowrap">
        {/* Since the file input element is invisible, we can hardcode an empty string as its value.
        This allows users to upload the same file multiple times. */}
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleSendFile}
          value={''}
          accept={ALLOWED_FILE_TYPES}
        />
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
            data-cy-send-message-button
          >
            <SendMessageIcon />
          </Button>
        </div>
      </Grid>
    </div>
  );
}
