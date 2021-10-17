import Game from 'components/Game';
import ParticipantList from 'components/ParticipantList/ParticipantList';
import React from 'react';

export const CarouselGameLayout = () => {
  return (
    <div className="flex flex-col w-full h-full space-y-10 pt-5">
      <ParticipantList />
      <div className="flex-grow">
        <Game />
      </div>
    </div>
  );
};
