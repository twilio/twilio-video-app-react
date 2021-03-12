import React from 'react';

interface MessageListScrollContainerProps {
  className: string;
}

export default class MessageListScrollContainer extends React.Component<MessageListScrollContainerProps> {
  chatThreadRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    const chatThreadRef = this.chatThreadRef.current;
    chatThreadRef!.scrollTop = chatThreadRef!.scrollHeight;
  }

  getSnapshotBeforeUpdate() {
    const chatThreadRef = this.chatThreadRef.current;
    if (chatThreadRef) {
      return chatThreadRef.clientHeight + chatThreadRef.scrollTop === chatThreadRef.scrollHeight;
    }
  }

  componentDidUpdate(_: any, __: any, snapshot?: Boolean) {
    const chatThreadRef = this.chatThreadRef.current;
    if (snapshot) {
      chatThreadRef!.scrollTop = chatThreadRef!.scrollHeight;
    }
  }

  render() {
    return (
      <div ref={this.chatThreadRef} className={this.props.className}>
        {this.props.children}
      </div>
    );
  }
}
