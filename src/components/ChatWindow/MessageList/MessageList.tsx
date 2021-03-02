import React from 'react';
import TextMessage from './TextMessage/TextMessage';
import MessageInfo from './MessageInfo/MessageInfo';
import { Message } from '@twilio/conversations/lib/message';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;

  return (
    <div style={{ padding: '0 1.2em' }}>
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
