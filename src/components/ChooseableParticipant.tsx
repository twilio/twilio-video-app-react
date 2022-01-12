import useSessionContext from 'hooks/useSessionContext';
import useVideoContext from 'hooks/useVideoContext/useVideoContext';
import MicIcon from 'icons/MicIcon';
import MicOffIcon from 'icons/MicOffIcon';
import React, { useEffect, useState } from 'react';
import { setCurrentPlayer, subscribeToCarouselGame, unsubscribeFromCarouselGame } from 'utils/firebase/game';
import { setActiveScreen } from 'utils/firebase/screen';
import { muteParticipant } from 'utils/firebase/session';
import Participant, { ParticipantProps } from './Participant/Participant';
import { ReactComponent as CarouselIcon } from '../assets/carousel.svg';
import { RoundButton, ROUND_BUTTON_SIZE } from './Buttons/RoundButton';
import { BanParticipantButton } from './Buttons/BanParticipantButton';
import { UserGroup } from 'types/UserGroup';
import { ScreenType } from 'types/ScreenType';

export interface ChooseableParticipantProps extends ParticipantProps {
  isMainSpeaker?: boolean;
}

export const ChooseableParticipant = (props: ChooseableParticipantProps) => {
  const { userGroup, groupToken, activeScreen } = useSessionContext();
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const [activePlayer, setActivePlayer] = useState<string>('');
  const [roundsPlayed, setRoundsPlayed] = useState<number>(0);

  useEffect(() => {
    const subId = activeScreen + props.participant.sid;
    if (groupToken !== undefined) {
      subscribeToCarouselGame(subId, groupToken, game => {
        setActivePlayer(prev => {
          if (prev !== game.currentPlayer) {
            return game.currentPlayer;
          } else {
            return prev;
          }
        });

        setRoundsPlayed(prev => {
          if (game.playerRoundCount !== undefined && typeof game.playerRoundCount[props.participant.sid] === 'number') {
            return game.playerRoundCount[props.participant.sid]!;
          }

          return prev;
        });
      });
    }

    return () => {
      unsubscribeFromCarouselGame(subId);
    };
  }, [groupToken]);

  if (!userGroup) {
    return null;
  }

  const isActivePlayer = activePlayer === props.participant.sid;

  return (
    <div
      className={
        'relative rounded-lg' + (isActivePlayer ? ' ring-4 ring-offset-2 ring-purple ring-opacity-80 z-20' : '')
      }
    >
      {userGroup === UserGroup.Moderator ? (
        <div className="group transition-all duration-500 bg-white opacity-0 hover:opacity-95 bg-opacity-30 absolute top-0 left-0 w-full h-full z-20 flex space-x-2 items-center justify-center rounded-lg">
          <RoundButton
            title="Drehberechtigung erteilen"
            active
            size={ROUND_BUTTON_SIZE.SEMI_SMALL}
            onClick={() => {
              setCurrentPlayer(groupToken as string, props.participant.sid, activePlayer);
              setActiveScreen(groupToken as string, ScreenType.Game);
            }}
          >
            <CarouselIcon />
          </RoundButton>

          {userGroup === UserGroup.Moderator && props.participant.sid !== localParticipant.sid ? (
            <>
              <RoundButton
                title="Spieler stummschalten"
                size={ROUND_BUTTON_SIZE.SEMI_SMALL}
                onClick={() => muteParticipant(groupToken!, props.participant.sid)}
              >
                {false ? <MicIcon className="w-7 h-7" /> : <MicOffIcon className="w-7 h-7" />}
              </RoundButton>
              <BanParticipantButton identity={props.participant.identity} />
            </>
          ) : null}
        </div>
      ) : null}
      <Participant
        {...props}
        isActivePlayer={isActivePlayer}
        roundsPlayed={roundsPlayed}
        videoPriority={props.isMainSpeaker ? 'high' : undefined}
      />
    </div>
  );
};
