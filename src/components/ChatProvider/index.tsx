import React, { createContext, useState } from 'react';

type ChatContextType = { isChatWindowOpen: boolean; setIsChatWindowOpen: (isChatWindowOpen: boolean) => void };

export const ChatContext = createContext<ChatContextType>(null!);

type ChatProviderProps = {
  children: React.ReactNode;
};

export function ChatProvider({ children }: ChatProviderProps) {
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);

  return <ChatContext.Provider value={{ isChatWindowOpen, setIsChatWindowOpen }}>{children}</ChatContext.Provider>;
}
