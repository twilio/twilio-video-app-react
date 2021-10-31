import useGameContext from 'hooks/useGameContext';
import React from 'react';
import { DEFAULT_QUESTION_COLOR } from 'types';

export const RevealedCard = () => {
  const { revealedCard } = useGameContext();

  const length = revealedCard?.name.length;

  console.log('revealed card chars: ', length);

  return (
    <div
      className="flex justify-center items-center text-center px-5 py-3 shadow-lg w-full h-full rounded-lg overflow-y-auto"
      style={{
        backgroundImage: "url('/assets/globe.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: '50%',
        backgroundPosition: 'center',
        backgroundColor: revealedCard?.color ?? DEFAULT_QUESTION_COLOR,
      }}
    >
      <p className={`text-white font-medium m-auto `}>{revealedCard?.name}</p>
    </div>
  );
};
