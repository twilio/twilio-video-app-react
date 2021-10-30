import useSessionContext from 'hooks/useSessionContext';
import useVideoContext from 'hooks/useVideoContext/useVideoContext';
import MicIcon from 'icons/MicIcon';
import MicOffIcon from 'icons/MicOffIcon';
import React, { useEffect, useState } from 'react';
import { ScreenType, UserGroup } from 'types';
import { setCurrentPlayer, subscribeToCarouselGame } from 'utils/firebase/game';
import { setActiveScreen } from 'utils/firebase/screen';
import { muteParticipant } from 'utils/firebase/session';
import Participant, { ParticipantProps } from './Participant/Participant';

export const ChooseableParticipant = (props: ParticipantProps) => {
  const { userGroup, groupToken } = useSessionContext();
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const [activePlayer, setActivePlayer] = useState<string>('');

  useEffect(() => {
    if (groupToken === undefined) {
      return;
    }

    subscribeToCarouselGame(props.participant.sid, groupToken, game =>
      setActivePlayer(prev => {
        if (prev !== game.currentPlayer) {
          return game.currentPlayer;
        } else {
          return prev;
        }
      })
    );
  }, [groupToken]);

  if (!userGroup) {
    return null;
  }

  const isActivePlayer = activePlayer === props.participant.sid;

  return (
    <div
      className={'relative rounded-xl overflow-hidden' + (isActivePlayer ? ' border-4 border-purple bg-purple' : '')}
    >
      {userGroup === UserGroup.Moderator && props.participant.sid !== localParticipant.sid ? (
        <div className="group transition-all duration-500 bg-white opacity-0 hover:opacity-95 bg-opacity-30 absolute top-0 left-0 w-full h-full z-30 flex space-x-2 items-center justify-center">
          <button
            className="text-black bg-white rounded-full cursor-pointer w-10 h-10 flex items-center justify-center"
            onClick={() => {
              setCurrentPlayer(groupToken as string, props.participant.sid);
              setActiveScreen(groupToken as string, ScreenType.Game);
            }}
          >
            <img src="/assets/carousel.svg" className="w-10 transform group-hover:scale-50" alt="Gluecksrad Icon" />
          </button>
          <button
            className="text-black bg-white rounded-full cursor-pointer w-10 h-10 flex items-center justify-center"
            onClick={() => muteParticipant(groupToken!, props.participant.sid)}
          >
            {false ? <MicIcon className="w-7 h-7" /> : <MicOffIcon className="w-7 h-7" />}
          </button>
        </div>
      ) : null}
      <Participant {...props} isActivePlayer={isActivePlayer} />
    </div>
  );
};
