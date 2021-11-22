import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { nameFromIdentity } from 'utils/participants';

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

  const name = nameFromIdentity(author);
  return (
    <div className={classes.messageInfoContainer}>
      <div>{isLocalParticipant ? `${name} (Du)` : name}</div>
      <div>{dateCreated}</div>
    </div>
  );
}
