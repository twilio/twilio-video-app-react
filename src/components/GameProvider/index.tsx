import React, { createContext, ReactNode, useState } from 'react';

export interface IGameContext {
  isGameVisible: boolean;
  toggleGameVisible: (val: boolean) => void;
}

export const GameContext = createContext<IGameContext>(null!);

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [isGameVisible, setGameVisible] = useState(false);

  return (
    <GameContext.Provider
      value={{
        isGameVisible: isGameVisible,
        toggleGameVisible: setGameVisible,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
