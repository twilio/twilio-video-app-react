import React from 'react';
import ChatWindow from '../ChatWindow/ChatWindow';
import BackgroundSelectionDialog from '../BackgroundSelectionDialog/BackgroundSelectionDialog';
import useSessionContext from 'hooks/useSessionContext';
import { ScreenType, UserGroup } from 'types';
import { GridVideoChatLayout } from 'components/Layouts/GridVideoChatLayout';
import { CarouselGameLayout } from 'components/Layouts/CarouselGameLayout';
import { RaisedHandsWindow } from 'components/RaisedHandsWindow';

const PoweredByBar = () => (
  <div className="fixed bottom-2 px-2 z-0 w-full flex items-center justify-between h-12 lg:h-20">
    <img src="/assets/artikel1.png" className="h-full" />
    <img src="/assets/demokratie-plattform.png" className="h-full" />
  </div>
);

export default function Room() {
  const { activeScreen, userGroup } = useSessionContext();

  const CurrentScreen = () => {
    if (activeScreen === ScreenType.Game) {
      return <CarouselGameLayout />;
    } else if (activeScreen === ScreenType.VideoChat) {
      return <GridVideoChatLayout />;
    }

    return null;
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow flex" style={{ paddingBottom: userGroup === UserGroup.StreamServer ? '2rem' : '8rem' }}>
        <CurrentScreen />
        <RaisedHandsWindow />
        <ChatWindow />
        <PoweredByBar />
      </div>
      <BackgroundSelectionDialog />
    </div>
  );
}
