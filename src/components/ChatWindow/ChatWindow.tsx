import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ChatWindowHeader from './ChatWindowHeader/ChatWindowHeader';
import MessageList from './MessageList/MessageList';
import useChatContext from '../../hooks/useChatContext/useChatContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
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

const arbitraryDate = new Date(1614635301000);

const messages = [
  {
    author: 'olivia',
    dateCreated: arbitraryDate,
    body: 'This is a message',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    type: 'text',
  },
  {
    author: 'tim',
    dateCreated: arbitraryDate,
    body: 'Hi Olivia!',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX2',
    type: 'text',
  },
  {
    author: 'tim',
    dateCreated: arbitraryDate,
    body: 'That is pretty rad double line message! How did you do that?',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX3',
    type: 'text',
  },
  {
    author: 'tim',
    dateCreated: arbitraryDate,
    body: '😉',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX4',
    type: 'text',
  },
  {
    author: 'olivia',
    dateCreated: new Date(1614635361000),
    body: 'Magic',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX5',
    type: 'text',
  },
  {
    author: 'olivia',
    dateCreated: new Date(1614635361000),
    body: 'lots of magic',
    sid: 'IMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX6',
    type: 'text',
  },
];

export default function ChatWindow() {
  const classes = useStyles();
  const { isChatWindowOpen } = useChatContext();

  //if chat window is not open, don't render this component
  if (!isChatWindowOpen) return null;

  return (
    <aside className={classes.container}>
      <ChatWindowHeader />
      <MessageList messages={messages} />
    </aside>
  );
}
