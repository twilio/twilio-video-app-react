import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ChatWindowHeader from './ChatWindowHeader/ChatWindowHeader';
import ChatInput from './ChatInput/ChatInput';
import clsx from 'clsx';
import MessageList from './MessageList/MessageList';
import useChatContext from '../../hooks/useChatContext/useChatContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chatWindowContainer: {
      background: '#FFFFFF',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '1px solid #E4E7E9',
      [theme.breakpoints.down('sm')]: {
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
    },
    hide: {
      display: 'none',
    },
  })
);

export default function ChatWindow() {
  const classes = useStyles();
  const { isChatWindowOpen, messages, conversation } = useChatContext();

  return (
    <aside className={clsx(classes.chatWindowContainer, { [classes.hide]: !isChatWindowOpen })}>
      <ChatWindowHeader />
      <MessageList messages={messages} />
      <ChatInput conversation={conversation!} />
    </aside>
  );
}
