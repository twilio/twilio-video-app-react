import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CloseChatWindowButton from '../Buttons/CloseChatWindowButton/CloseChatWindowButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: `${theme.chatWindowHeaderHeight}px`,
      background: '#F4F4F6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: '1em',
      paddingRight: '1em',
    },
    text: {
      fontWeight: 'bold',
    },
    closeChatWindow: {
      cursor: 'pointer',
    },
  })
);

export default function ChatWindowHeader() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.text}>Chat</div>
      <div className={classes.closeChatWindow}>
        <CloseChatWindowButton />
      </div>
    </div>
  );
}
