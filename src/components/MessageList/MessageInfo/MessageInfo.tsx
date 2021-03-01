import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { LocalParticipant } from 'twilio-video';

const useStyles = makeStyles(() =>
  createStyles({
    messageInfoContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.425em 1em 0.083em',
      fontSize: '12px',
      color: '#606B85',
    },
  })
);

interface MessageInfoProps {
  localParticipant: LocalParticipant;
  author: string;
  dateCreated: string;
}

export default function MessageInfo({ localParticipant, author, dateCreated }: MessageInfoProps) {
  const classes = useStyles();
  return (
    <div className={classes.messageInfoContainer}>
      <div>{author === localParticipant.identity ? `${author} (You)` : author}</div>
      <div>{dateCreated}</div>
    </div>
  );
}
