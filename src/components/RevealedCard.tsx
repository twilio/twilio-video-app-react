import useGameContext from 'hooks/useGameContext';
import React from 'react';

export const RevealedCard = () => {
  const { revealedCard } = useGameContext();

  return (
    <div
      className="flex justify-center items-center text-center px-5 py-3 shadow-lg bg-purple w-full h-full rounded-lg overflow-y-auto"
      style={{
        backgroundImage: "url('/assets/globe.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: '50%',
        backgroundPosition: 'center',
      }}
    >
      <p className="text-white text-base lg:text-lg font-medium m-auto">{revealedCard}</p>
    </div>
  );
};
