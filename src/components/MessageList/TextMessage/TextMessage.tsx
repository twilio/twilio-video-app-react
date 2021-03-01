import React from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/core/styles';

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
  isLocalParticipant: boolean;
}

export default function TextMessage({ body, isLocalParticipant }: TextMessageProps) {
  const classes = useStyles();
  return (
    <div>
      <div
        className={clsx(classes.messageContainer, {
          [classes.localParticipant]: isLocalParticipant,
        })}
      >
        <div>{body}</div>
      </div>
    </div>
  );
}
