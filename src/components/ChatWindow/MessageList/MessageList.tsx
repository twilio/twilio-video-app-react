import React from 'react';
import TextMessage from './TextMessage/TextMessage';
import MessageInfo from './MessageInfo/MessageInfo';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

interface Message {
  author: string;
  dateCreated: Date;
  body: string;
  sid: string;
  type: string;
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;

  return (
    <>
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
    </>
  );
}
