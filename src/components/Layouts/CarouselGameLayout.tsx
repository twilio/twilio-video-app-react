import Game from 'components/Game';
import ParticipantList from 'components/ParticipantList/ParticipantList';
import { SessionInfo } from 'components/SessionInfo';
import React from 'react';

export const CarouselGameLayout = () => {
  return (
    <div className="flex flex-col container mx-auto h-full space-y-10 pt-5">
      <div className="flex justify-between w-full items-center">
        <ParticipantList />
        <SessionInfo />
      </div>
      <div className="flex-grow">
        <Game />
      </div>
    </div>
  );
};
