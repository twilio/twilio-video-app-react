import useSessionContext from 'hooks/useSessionContext';
import React, { createContext, ReactNode, useState, useEffect } from 'react';
import { IQuestion } from 'types';
import { fetchCarouselGame, fetchQuestions } from 'utils/firebase/game';

type GameContext = {
  revealedCard: string | undefined;
  setRevealedCard: (content: string) => void;
  questions: IQuestion[];
};

export const GameContext = createContext<GameContext>(null!);

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [revealedCard, setRevealedCard] = useState<string>();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [fetched, setFetched] = useState(false);
  const { groupToken } = useSessionContext();

  useEffect(() => {
    if (!fetched && groupToken) {
      setFetched(true);
      Promise.all([fetchCarouselGame(groupToken), fetchQuestions()]).then(([game, questions]) => {
        const active = game.activeCard;
        if (active >= 0 && active < questions.length) {
          setRevealedCard(questions[active].name);
        }
        setQuestions(questions);
      });
    }
  }, [groupToken]);

  return (
    <GameContext.Provider
      value={{
        revealedCard,
        setRevealedCard: (val: string) => {
          setRevealedCard(val);
        },
        questions,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
