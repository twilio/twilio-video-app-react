import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import ChatIcon from '../../../icons/ChatIcon';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export const ANIMATION_DURATION = 700;

const useStyles = makeStyles({
  iconContainer: {
    position: 'relative',
    display: 'flex',
  },
  circle: {
    width: '10px',
    height: '10px',
    backgroundColor: '#5BB75B',
    borderRadius: '50%',
    position: 'absolute',
    top: '-3px',
    left: '13px',
    opacity: 0,
    transition: `opacity ${ANIMATION_DURATION * 0.5}ms ease-in`,
  },
  hasUnreadMessages: {
    opacity: 1,
  },
  ring: {
    border: '3px solid #5BB75B',
    borderRadius: '30px',
    height: '14px',
    width: '14px',
    position: 'absolute',
    left: '11px',
    top: '-5px',
    opacity: 0,
  },
  animateRing: {
    animation: `$expand ${ANIMATION_DURATION}ms ease-out`,
    animationIterationCount: 1,
  },
  '@keyframes expand': {
    '0%': {
      transform: 'scale(0.1, 0.1)',
      opacity: 0,
    },
    '50%': {
      opacity: 1,
    },
    '100%': {
      transform: 'scale(1.4, 1.4)',
      opacity: 0,
    },
  },
});

export default function ToggleChatButton() {
  const classes = useStyles();
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
    <Button
      data-cy-chat-button
      onClick={toggleChatWindow}
      disabled={!conversation}
      startIcon={
        <div className={classes.iconContainer}>
          <ChatIcon />
          <div className={clsx(classes.ring, { [classes.animateRing]: shouldAnimate })} />
          <div className={clsx(classes.circle, { [classes.hasUnreadMessages]: hasUnreadMessages })} />
        </div>
      }
    >
      Chat
    </Button>
  );
}
