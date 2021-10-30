import useSessionContext from 'hooks/useSessionContext';
import React from 'react';
import { ScreenType } from 'types';
import { setActiveScreen } from 'utils/firebase/screen';
import { ReactComponent as CarouselIcon } from '../../assets/carousel.svg';
import { ReactComponent as GridViewIcon } from '../../assets/grid-view.svg';

export const ScreenToggleButton = (props: { className?: string }) => {
  const { activeScreen, groupToken } = useSessionContext();

  const toggleGameScreen = () => {
    setActiveScreen(
      groupToken as string,
      activeScreen === ScreenType.VideoChat ? ScreenType.Game : ScreenType.VideoChat
    );
  };

  return (
    <button className={props.className} onClick={toggleGameScreen}>
      {activeScreen === ScreenType.Game ? (
        <GridViewIcon className="w-22 h-22" />
      ) : (
        <CarouselIcon className="w-22 h-22" />
      )}
    </button>
  );
};
