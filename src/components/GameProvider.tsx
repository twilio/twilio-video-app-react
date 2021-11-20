import useSessionContext from 'hooks/useSessionContext';
import React, { createContext, ReactNode, useState, useEffect } from 'react';
import { IQuestion } from 'types';
import { fetchCarouselGame, fetchQuestions } from 'utils/firebase/game';

type GameContext = {
  revealedCard: IQuestion | undefined;
  setRevealedCard: (content: IQuestion | undefined) => void;
  questions: IQuestion[];
};

export const GameContext = createContext<GameContext>(null!);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = React.memo(({ children }: GameProviderProps) => {
  const [revealedCard, setRevealedCard] = useState<IQuestion>();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [fetched, setFetched] = useState(false);
  const { groupToken } = useSessionContext();

  useEffect(() => {
    if (!fetched && groupToken) {
      setFetched(true);
      Promise.all([fetchCarouselGame(groupToken), fetchQuestions()]).then(([game, questions]) => {
        const active = game.activeCard;
        if (active >= 0 && active < questions.length) {
          setRevealedCard(questions[active]);
        }
        setQuestions(questions);
      });
    }
  }, [groupToken]);

  return (
    <GameContext.Provider
      value={{
        revealedCard,
        setRevealedCard,
        questions,
      }}
    >
      {children}
    </GameContext.Provider>
  );
});
