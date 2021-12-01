import React from 'react';
import ChatWindowHeader from './ChatWindowHeader/ChatWindowHeader';
import ChatInput from './ChatInput/ChatInput';
import MessageList from './MessageList/MessageList';
import useChatContext from '../../hooks/useChatContext/useChatContext';

export default function ChatWindow() {
  const { isChatWindowOpen, messages, conversation } = useChatContext();

  return (
    <div
      className="bg-white z-50 shadow-xl flex flex-col h-screen w-full md:w-[200px] xl:w-[250px] 2xl:w-[300px] fixed left-0 pl-2"
      style={{ display: isChatWindowOpen ? '' : 'none' }}
    >
      <ChatWindowHeader />
      <MessageList messages={messages} />
      <ChatInput conversation={conversation!} isChatWindowOpen={isChatWindowOpen} />
    </div>
  );
}
