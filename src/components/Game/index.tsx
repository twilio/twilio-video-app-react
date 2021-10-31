import useGameContext from 'hooks/useGameContext';
import React from 'react';
import { getFirebase } from 'utils/firebase/base';
import VerticalCarousel from '../VerticalCarousel';

const firebase = getFirebase();

function Game() {
  const { questions } = useGameContext();

  return (
    <div className="w-full h-full z-0 bg-grayish">
      <VerticalCarousel questions={questions} />
    </div>
  );
}

export default Game;
