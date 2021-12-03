import React, { useEffect, useState } from 'react';
import ChatIcon from '../../../icons/ChatIcon';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { RoundButton } from '../RoundButton';

export const ANIMATION_DURATION = 700;

export default function ToggleChatButton(props: { className?: string }) {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const { isChatWindowOpen, setIsChatWindowOpen, conversation, hasUnreadMessages } = useChatContext();
  const { setIsBackgroundSelectionOpen } = useVideoContext();

  const toggleChatWindow = () => {
    setIsChatWindowOpen(!isChatWindowOpen);
    setIsBackgroundSelectionOpen(false);
  };

  useEffect(() => {
    if (shouldAnimate) {
      setTimeout(() => setShouldAnimate(false), ANIMATION_DURATION);
    }
  }, [shouldAnimate]);

  useEffect(() => {
    if (conversation && !isChatWindowOpen) {
      const handleNewMessage = () => setShouldAnimate(true);
      conversation.on('messageAdded', handleNewMessage);
      return () => {
        conversation.off('messageAdded', handleNewMessage);
      };
    }
  }, [conversation, isChatWindowOpen]);

  return (
    <RoundButton
      title="Chat Fenster öffnen"
      onClick={toggleChatWindow}
      disabled={!conversation}
      indicator={hasUnreadMessages}
      active={isChatWindowOpen}
    >
      <ChatIcon />
    </RoundButton>
  );
}
