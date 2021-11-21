import React from 'react';
import ChatWindow from '../ChatWindow/ChatWindow';
import BackgroundSelectionDialog from '../BackgroundSelectionDialog/BackgroundSelectionDialog';
import useSessionContext from 'hooks/useSessionContext';
import { ScreenType, UserGroup } from 'types';
import { GridVideoChatLayout } from 'components/Layouts/GridVideoChatLayout';
import { CarouselGameLayout } from 'components/Layouts/CarouselGameLayout';
import { RaisedHandsWindow } from 'components/RaisedHandsWindow';

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
      <div
        className="flex-grow flex"
        style={{ paddingBottom: userGroup === UserGroup.StreamServer ? '2rem' : '32rem' }}
      >
        <CurrentScreen />
        <RaisedHandsWindow />
        <ChatWindow />
      </div>
      <BackgroundSelectionDialog />
    </div>
  );
}
