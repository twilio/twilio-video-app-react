import useGameContext from 'hooks/useGameContext';
import React, { useState, useEffect } from 'react';
import { getFirebase } from 'utils/firebase/base';
import { fetchQuestions } from 'utils/firebase/game';
// import getFirebase from '../../firebase.config';
import VerticalCarousel from '../VerticalCarousel';

const firebase = getFirebase();

function Game() {
  const { questions } = useGameContext();

  return (
    <div className="w-full h-full z-0 bg-grayish">
      <VerticalCarousel data={questions} />
    </div>
  );
}

export default Game;
