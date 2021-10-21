import React from 'react';
import ChatWindow from '../ChatWindow/ChatWindow';
import BackgroundSelectionDialog from '../BackgroundSelectionDialog/BackgroundSelectionDialog';
import useSessionContext from 'hooks/useSessionContext';
import { ScreenType } from 'types';
import { GridVideoChatLayout } from 'components/Layouts/GridVideoChatLayout';
import { CarouselGameLayout } from 'components/Layouts/CarouselGameLayout';

export default function Room() {
  const { sessionData } = useSessionContext();

  const CurrentScreen = () => {
    if (sessionData?.activeScreen === ScreenType.Game) {
      return <CarouselGameLayout />;
    } else if (sessionData?.activeScreen === ScreenType.VideoChat) {
      return <GridVideoChatLayout />;
    }

    return null;
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow pb-32">
        <CurrentScreen />
      </div>
      <ChatWindow />
      <BackgroundSelectionDialog />
    </div>
  );
}
