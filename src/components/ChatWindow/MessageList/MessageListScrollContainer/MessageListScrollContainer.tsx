/* istanbul ignore file */
import Button from '@material-ui/core/Button';
import { WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { Message } from '@twilio/conversations';
import clsx from 'clsx';
import throttle from 'lodash.throttle';
import React, { useEffect, useRef, useState } from 'react';

const styles = createStyles({
  outerContainer: {
    minHeight: 0,
    flex: 1,
    position: 'relative',
  },
  innerScrollContainer: {
    height: '100%',
    overflowY: 'auto',
    padding: '0 1.2em 0',
  },
  messageListContainer: {
    overflowY: 'auto',
    flex: '1',
    paddingBottom: '1em',
  },
  button: {
    position: 'absolute',
    bottom: '14px',
    right: '2em',
    zIndex: 100,
    padding: '0.5em 0.9em',
    visibility: 'hidden',
    opacity: 0,
    boxShadow: '0px 4px 16px rgba(18, 28, 45, 0.2)',
    transition: 'all 0.5s ease',
  },
  showButton: {
    visibility: 'visible',
    opacity: 1,
    bottom: '24px',
  },
});

interface MessageListScrollContainerProps extends WithStyles<typeof styles> {
  messages: Message[];
}

/*
 * This component is a scrollable container that wraps around the 'MessageList' component.
 * The MessageList will ultimately grow taller than its container as it continues to receive
 * new messages, and users will need to have the ability to scroll up and down the chat window.
 * A "new message" button will be displayed when the user receives a new message, and is not scrolled
 * to the bottom. This button will be hidden if the user clicks on it, or manually scrolls
 * to the bottom. Otherwise, this component will auto-scroll to the bottom when a new message is
 * received, and the user is already scrolled to the bottom.
 *
 * Note that this component is tested with Cypress only.
 */

const MessageListScrollContainer: React.FC<MessageListScrollContainerProps> = ({ classes, messages, children }) => {
  const chatThreadRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [messageNotificationCount, setMessageNotificationCount] = useState(0);

  const scrollToBottom = () => {
    const innerScrollContainerEl = chatThreadRef.current;
    if (!innerScrollContainerEl) return;
    innerScrollContainerEl.scrollTop = innerScrollContainerEl.scrollHeight;
  };

  const handleScroll = throttle(() => {
    const innerScrollContainerEl = chatThreadRef.current;
    if (!innerScrollContainerEl) return;

    const scrolledToBottom =
      Math.abs(
        innerScrollContainerEl.clientHeight + innerScrollContainerEl.scrollTop - innerScrollContainerEl.scrollHeight
      ) < 1;

    setIsScrolledToBottom(scrolledToBottom);
    if (!scrolledToBottom) setShowButton(true);
  }, 300);

  useEffect(() => {
    scrollToBottom();
    const innerScrollContainerEl = chatThreadRef.current;
    if (innerScrollContainerEl) {
      innerScrollContainerEl.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (innerScrollContainerEl) {
        innerScrollContainerEl.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const hasNewMessages = messages.length !== 0;
    if (isScrolledToBottom && hasNewMessages) {
      scrollToBottom();
    } else if (hasNewMessages) {
      const numberOfNewMessages = messages.length;
      // If 'new message' btn is visible, messageNotificationCount will be the number of prev. unread msgs + the number of new msgs.
      setShowButton(!isScrolledToBottom);
      setMessageNotificationCount(showButton ? messageNotificationCount + numberOfNewMessages : 1);
    }
  }, [messages]);

  const handleClick = () => {
    scrollToBottom();
    setShowButton(false);
  };

  return (
    <div className={classes.outerContainer}>
      <div className={classes.innerScrollContainer} ref={chatThreadRef} data-cy-message-list-inner-scroll>
        <div className={classes.messageListContainer}>
          {children}
          <Button
            className={clsx(classes.button, { [classes.showButton]: showButton })}
            onClick={handleClick}
            startIcon={<ArrowDownwardIcon />}
            color="primary"
            variant="contained"
            data-cy-new-message-button
          >
            {messageNotificationCount} new message{messageNotificationCount > 1 && 's'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(MessageListScrollContainer);
