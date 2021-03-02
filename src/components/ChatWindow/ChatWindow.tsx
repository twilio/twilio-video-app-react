import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ChatWindowHeader from './ChatWindowHeader/ChatWindowHeader';
import MessageList from './MessageList/MessageList';
import useChatContext from '../../hooks/useChatContext/useChatContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chatWindowContainer: {
      overflowY: 'auto',
      background: '#FFFFFF',
      zIndex: 100,
      [theme.breakpoints.down('sm')]: {
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
    },
  })
);

export default function ChatWindow() {
  const classes = useStyles();
  const { isChatWindowOpen, messages } = useChatContext();

  //if chat window is not open, don't render this component
  if (!isChatWindowOpen) return null;

  return (
    <aside className={classes.chatWindowContainer}>
      <ChatWindowHeader />
      <MessageList messages={messages} />
    </aside>
  );
}
