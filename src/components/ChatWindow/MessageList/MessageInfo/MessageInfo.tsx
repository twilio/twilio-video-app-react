import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    messageInfoContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.425em 0 0.083em',
      fontSize: '12px',
      color: '#606B85',
    },
  })
);

interface MessageInfoProps {
  author: string;
  dateCreated: string;
  isLocalParticipant: boolean;
}

export default function MessageInfo({ author, dateCreated, isLocalParticipant }: MessageInfoProps) {
  const classes = useStyles();

  return (
    <div className={classes.messageInfoContainer}>
      <div>{isLocalParticipant ? `${author} (You)` : author}</div>
      <div>{dateCreated}</div>
    </div>
  );
}
