import React, { useState, useEffect } from 'react';
import { Message } from '@twilio/conversations/lib/message';
import MessageListScrollContainer from './MessageListScrollContainer/MessageListScrollContainer';
import TextMessage from './TextMessage/TextMessage';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { nameFromIdentity, uidFromIdentity } from 'utils/participants';
import { getUid } from 'utils/firebase/base';
import useLanguageContext from 'hooks/useLanguageContext';
import { LANGUAGE_CODE } from 'types/Language';

interface MessageListProps {
  messages: Message[];
}

const getFormattedTime = (langCode: string, message?: Message) =>
  message?.dateCreated.toLocaleTimeString(langCode, { hour: 'numeric', minute: 'numeric' }).toLowerCase();

export default function MessageList({ messages }: MessageListProps) {
  const { langCode } = useLanguageContext();
  // const localParticipant = room!.localParticipant;
  const [uid, setUid] = useState<string>();

  const ownMessageLabel = langCode === LANGUAGE_CODE.de_DE ? 'Du um' : 'You at';

  useEffect(() => {
    getUid().then(setUid);
  }, []);

  return (
    <MessageListScrollContainer messages={messages}>
      {messages.map((message, idx) => {
        const time = getFormattedTime(langCode, message)!;
        const previousTime = getFormattedTime(langCode, messages[idx - 1]);
        const nextTime = getFormattedTime(langCode, messages[idx + 1]);

        // Display the MessageInfo component when the author or formatted timestamp differs from the previous message
        const shouldDisplayMessageHead = time !== previousTime || message.author !== messages[idx - 1]?.author;
        const shouldDisplayMessageTime =
          time !== nextTime || message.author !== messages[idx + 1]?.author || messages[idx + 1] === undefined;

        const isLocalParticipant = uidFromIdentity(message.author) === uid;

        return (
          <div key={message.sid}>
            {shouldDisplayMessageHead && (
              <div className="flex flex-col pt-5">
                <div className="w-full break-words font-medium">{nameFromIdentity(message.author)}</div>
              </div>
            )}
            {message.type === 'text' && <TextMessage body={message.body} isLocalParticipant={isLocalParticipant} />}
            {/* {message.type === 'media' && <MediaMessage media={message.media} />} */}
            {shouldDisplayMessageTime ? (
              <div className="w-full pt-1">{`${isLocalParticipant ? ownMessageLabel : ''} ${time}`}</div>
            ) : null}
          </div>
        );
      })}
    </MessageListScrollContainer>
  );
}
