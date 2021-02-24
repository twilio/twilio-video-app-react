import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Client } from '@twilio/conversations';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Conversation } from '@twilio/conversations/lib/conversation';
import { Message } from '@twilio/conversations/lib/message';
import useRoomState from '../../hooks/useRoomState/useRoomState';

type ChatContextType = {
  isChatWindowOpen: boolean;
  setIsChatWindowOpen: (isChatWindowOpen: boolean) => void;
  connect: (token: string) => void;
  hasUnreadMessages: boolean;
  messages: Message[];
  conversation?: Conversation;
};

export const ChatContext = createContext<ChatContextType>(null!);

type ChatProviderProps = {
  children: React.ReactNode;
};

export function ChatProvider({ children }: ChatProviderProps) {
  const { room } = useVideoContext();
  const state = useRoomState();
  const isChatWindowOpenRef = useRef(false);
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const [conversation, setConversation] = useState<Conversation>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [chatClient, setChatClient] = useState<Client>();

  const connect = useCallback((token: string) => {
    Client.create(token).then(client => {
      //@ts-ignore
      window.chatClient = client;
      setChatClient(client);
    });
  }, []);

  useEffect(() => {
    const handleMessageAdded = (message: Message) => setMessages(oldMessages => [...oldMessages, message]);

    if (conversation) {
      conversation.getMessages().then(messages => setMessages(messages.items));
      conversation.on('messageAdded', handleMessageAdded);
      return () => {
        conversation.off('messageAdded', handleMessageAdded);
      };
    }
  }, [conversation]);

  useEffect(() => {
    if (!isChatWindowOpenRef.current) {
      setHasUnreadMessages(true);
    }
  }, [messages]);

  useEffect(() => {
    isChatWindowOpenRef.current = isChatWindowOpen;
    if (isChatWindowOpen) setHasUnreadMessages(false);
  }, [isChatWindowOpen]);

  useEffect(() => {
    if (room && chatClient) {
      chatClient.getConversationByUniqueName(room.sid).then(conversation => {
        //@ts-ignore
        window.chatConversation = conversation;
        setConversation(conversation);
      });
    }
  }, [room, chatClient]);

  return (
    <ChatContext.Provider
      value={{ isChatWindowOpen, setIsChatWindowOpen, connect, hasUnreadMessages, messages, conversation }}
    >
      {children}
    </ChatContext.Provider>
  );
}
