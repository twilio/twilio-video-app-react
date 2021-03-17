import React from 'react';
import clsx from 'clsx';
import { Message } from '@twilio/conversations/lib/message';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Button from '@material-ui/core/Button';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';

const styles = createStyles({
  messageListContainer: {
    overflowY: 'auto',
    flex: '1',
  },
  outerContainer: {
    minHeight: 0,
    flex: 1,
    position: 'relative',
  },
  innerScrollContainer: {
    height: '100%',
    overflowY: 'auto',
    padding: '0 1.2em 1em',
  },
  unread: {
    position: 'absolute',
    bottom: '14px',
    backgroundColor: '#027AC5',
    right: '1.2em',
    zIndex: 100,
    display: 'flex',
    padding: '0.5em 0.9em',
    alignItems: 'center',
    color: 'white',
    visibility: 'visible',
    opacity: 1,
    boxShadow: '0px 4px 16px rgba(18, 28, 45, 0.2)',
    '&:hover': {
      backgroundColor: '#027AC5',
    },
  },
  messagesRead: {
    transition: 'all 0.5s ease',
    visibility: 'hidden',
    opacity: 0,
  },
});

interface MessageListScrollContainerProps extends WithStyles<typeof styles> {
  messages: Message[];
}

interface MessageListScrollContainerState {
  isScrolledToBottom: boolean;
  unreadMessagesCount: number;
  messageNotificationCount: number;
}
export class MessageListScrollContainer extends React.Component<
  MessageListScrollContainerProps,
  MessageListScrollContainerState
> {
  chatThreadRef = React.createRef<HTMLDivElement>();
  // change unreadMessagesCount to boolean? if unread is true
  state = { isScrolledToBottom: true, unreadMessagesCount: 0, messageNotificationCount: 0 };

  componentDidMount() {
    const chatThreadRef = this.chatThreadRef.current!;
    chatThreadRef.scrollTop = chatThreadRef!.scrollHeight;
    chatThreadRef.addEventListener('scroll', this.handleScroll);
  }

  getSnapshotBeforeUpdate() {
    const chatThreadRef = this.chatThreadRef.current;
    if (chatThreadRef) {
      return chatThreadRef.clientHeight + chatThreadRef.scrollTop === chatThreadRef.scrollHeight;
    }
  }

  componentDidUpdate(prevProps: any, __: any, snapshot?: boolean) {
    const chatThreadRef = this.chatThreadRef.current!;
    if (snapshot) {
      chatThreadRef.scrollTop = chatThreadRef.scrollHeight;
    } else if (this.props.messages.length !== prevProps.messages.length) {
      this.setState(prevState => ({
        unreadMessagesCount: prevState.unreadMessagesCount + 1,
        messageNotificationCount: prevState.unreadMessagesCount + 1,
      }));
    }
  }

  handleScroll = () => {
    const chatThreadRef = this.chatThreadRef.current!;
    const isScrolledToBottom = chatThreadRef.clientHeight + chatThreadRef.scrollTop === chatThreadRef!.scrollHeight;
    this.setState(prevState => ({
      isScrolledToBottom,
      unreadMessagesCount: isScrolledToBottom ? 0 : prevState.unreadMessagesCount,
    }));
  };

  handleClick = () => {
    const chatThreadRef = this.chatThreadRef.current!;
    chatThreadRef.scrollTo({ top: 10000, behavior: 'smooth' });
  };

  componentWillUnmount() {
    const chatThreadRef = this.chatThreadRef.current!;
    chatThreadRef.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.outerContainer}>
        <div className={classes.innerScrollContainer} ref={this.chatThreadRef}>
          <div className={classes.messageListContainer}>
            {this.props.children}
            <Button
              className={clsx(classes.unread, { [classes.messagesRead]: this.state.unreadMessagesCount === 0 })}
              onClick={this.handleClick}
              startIcon={<ArrowDownwardIcon />}
            >
              {this.state.messageNotificationCount === 1 && '1 new message'}
              {this.state.messageNotificationCount > 1 && `${this.state.messageNotificationCount} new messages`}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(MessageListScrollContainer);
