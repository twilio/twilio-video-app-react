import React, { useEffect, useState } from 'react';
import ChatIcon from '../../../icons/ChatIcon';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export const ANIMATION_DURATION = 700;

export default function ToggleChatButton(props: { className?: string }) {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const { isChatWindowOpen, setIsChatWindowOpen, conversation, hasUnreadMessages } = useChatContext();
  const { setIsBackgroundSelectionOpen } = useVideoContext();

  const toggleChatWindow = () => {
    setIsChatWindowOpen(!isChatWindowOpen);
    setIsBackgroundSelectionOpen(false);
    console.log('toggle');
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
    <button
      data-cy-chat-button
      onClick={toggleChatWindow}
      className={props.className + ' relative'}
      disabled={!conversation}
      // startIcon={
      //   <div className={classes.iconContainer}>

      //     <div className={clsx(classes.ring, { [classes.animateRing]: shouldAnimate })} />
      //     <div className={clsx(classes.circle, { [classes.hasUnreadMessages]: hasUnreadMessages })} />
      //   </div>
      // }
    >
      <div
        className="absolute top-0 right-0 h-3 w-3 bg-red rounded-full"
        style={{ display: hasUnreadMessages ? 'block' : 'none' }}
      />
      <ChatIcon />
    </button>
  );
}
