import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core';
import ChatWindow from '../ChatWindow/ChatWindow';
import ParticipantList from '../ParticipantList/ParticipantList';
import BackgroundSelectionDialog from '../BackgroundSelectionDialog/BackgroundSelectionDialog';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import Game from '../Game';
import useSessionContext from 'hooks/useSessionContext';
import { ScreenType } from 'types';
import { GridVideoChatLayout } from 'components/Layouts/GridVideoChatLayout';
import { CarouselGameLayout } from 'components/Layouts/CarouselGameLayout';

export default function Room() {
  const { isChatWindowOpen } = useChatContext();
  const { isBackgroundSelectionOpen } = useVideoContext();
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
    <div className="flex flex-col bg-grayish h-screen">
      <div className="flex-grow pb-40">
        <CurrentScreen />
      </div>
      <ChatWindow />
      <BackgroundSelectionDialog />
    </div>
  );
}
