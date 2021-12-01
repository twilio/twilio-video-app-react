import useSessionContext from 'hooks/useSessionContext';
import React from 'react';
import { ScreenType } from 'types';
import { setActiveScreen } from 'utils/firebase/screen';
import { ReactComponent as CarouselIcon } from '../../assets/carousel.svg';
import { ReactComponent as GridViewIcon } from '../../assets/grid-view.svg';
import { RoundButton, ROUND_BUTTON_SIZE } from './RoundButton';

export const ScreenSwitchButton = () => {
  const { activeScreen, groupToken } = useSessionContext();

  const toggleGameScreen = () => {
    setActiveScreen(
      groupToken as string,
      activeScreen === ScreenType.VideoChat ? ScreenType.Game : ScreenType.VideoChat
    );
  };

  return (
    <RoundButton
      title={`Zum ${activeScreen === ScreenType.VideoChat ? 'Videokonferenz' : 'Spielrad'} Bildschirm wechseln`}
      active
      size={ROUND_BUTTON_SIZE.LARGE}
      onClick={toggleGameScreen}
    >
      {activeScreen === ScreenType.Game ? (
        <GridViewIcon className="w-22 h-22" />
      ) : (
        <CarouselIcon className="w-22 h-22" />
      )}
    </RoundButton>
  );
};
