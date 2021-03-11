import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Message } from '@twilio/conversations/lib/message';
import MessageInfo from './MessageInfo/MessageInfo';
import TextMessage from './TextMessage/TextMessage';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

interface MessageListProps {
  messages: Message[];
}

const useStyles = makeStyles({
  messageListContainer: {
    padding: '0 1.2em 1em',
    overflowY: 'auto',
    flex: 1,
  },
});

export default function MessageList({ messages }: MessageListProps) {
  const classes = useStyles();
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;

  return (
    <div className={classes.messageListContainer}>
      {messages.map((message, idx) => {
        const time = message.dateCreated
          .toLocaleTimeString('en-us', { hour: 'numeric', minute: 'numeric' })
          .toLowerCase();
        const isLocalParticipant = localParticipant.identity === message.author;

        return (
          <React.Fragment key={message.sid}>
            {messages[idx - 1]?.author !== message.author && (
              <MessageInfo author={message.author} isLocalParticipant={isLocalParticipant} dateCreated={time} />
            )}
            {message.type === 'text' && <TextMessage body={message.body} isLocalParticipant={isLocalParticipant} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
