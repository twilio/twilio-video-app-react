import React from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { LocalParticipant } from 'twilio-video';

const useStyles = makeStyles(() =>
  createStyles({
    messageContainer: {
      borderRadius: '16px',
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.5em 0.8em 0.6em',
      margin: '0.5em 0.8em -0.19em',
      wordBreak: 'break-word',
      backgroundColor: '#E1E3EA',
    },
    localParticipant: {
      backgroundColor: '#CCE4FF',
    },
  })
);

interface TextMessageProps {
  body: string;
  author: string;
  localParticipant: LocalParticipant;
}

export default function TextMessage({ body, author, localParticipant }: TextMessageProps) {
  const classes = useStyles();
  return (
    <div>
      <div
        className={clsx(classes.messageContainer, {
          [classes.localParticipant]: author === localParticipant.identity,
        })}
      >
        <div>{body}</div>
      </div>
    </div>
  );
}
