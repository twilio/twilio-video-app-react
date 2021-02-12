import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CloseChatWindowButton from '../Buttons/CloseChatWindowButton/CloseChatWindowButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'absolute',
      width: `${theme.chatWindowWidth}px`,
      height: `${theme.chatWindowHeaderHeight}px`,
      background: '#F4F4F6',
      [theme.breakpoints.down('sm')]: {
        width: '100vw',
      },
    },
    text: {
      fontWeight: 'bold',
      position: 'absolute',
      top: '32.14%',
      left: '16px',
      bottom: '32.14%',
    },
    closeButton: {
      position: 'absolute',
      right: 0,
      top: 'calc(50% - 40px/2)',
    },
  })
);

export default function ChatWindowHeader() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.text}>Chat</div>
      <div className={classes.closeButton}>
        <CloseChatWindowButton />
      </div>
    </div>
  );
}
