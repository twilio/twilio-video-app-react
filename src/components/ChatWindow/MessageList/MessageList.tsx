import { Message } from '@twilio/conversations';
import React from 'react';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import MediaMessage from './MediaMessage/MediaMessage';
import MessageInfo from './MessageInfo/MessageInfo';
import MessageListScrollContainer from './MessageListScrollContainer/MessageListScrollContainer';
import TextMessage from './TextMessage/TextMessage';

interface MessageListProps {
  messages: Message[];
}

const getFormattedTime = (message?: Message) =>
  message?.dateCreated?.toLocaleTimeString('en-us', { hour: 'numeric', minute: 'numeric' }).toLowerCase();

export default function MessageList({ messages }: MessageListProps) {
  const { room } = useVideoContext();
  const localParticipant = room && room.localParticipant;

  return (
    <MessageListScrollContainer messages={messages}>
      {messages.map((message, idx) => {
        const time = getFormattedTime(message)!;
        const previousTime = getFormattedTime(messages[idx - 1]);

        // Display the MessageInfo component when the author or formatted timestamp differs from the previous message
        const shouldDisplayMessageInfo = time !== previousTime || message.author !== messages[idx - 1]?.author;

        const isLocalParticipant = localParticipant && localParticipant.identity === message.author;

        if (message.author && message.body && message.attachedMedia && isLocalParticipant) {
          return (
            <React.Fragment key={message.sid}>
              {shouldDisplayMessageInfo && (
                <MessageInfo author={message.author} isLocalParticipant={isLocalParticipant} dateCreated={time} />
              )}
              {message.type === 'text' && <TextMessage body={message.body} isLocalParticipant={isLocalParticipant} />}
              {message.type === 'media' && <MediaMessage media={message.attachedMedia[0]} />}
            </React.Fragment>
          );
        }
      })}
    </MessageListScrollContainer>
  );
}
