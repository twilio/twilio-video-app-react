import useSessionContext from 'hooks/useSessionContext';
import useVideoContext from 'hooks/useVideoContext/useVideoContext';
import React from 'react';
import { ScreenType, UserGroup } from 'types';
import { setCurrentPlayer } from 'utils/firebase/game';
import { setActiveScreen } from 'utils/firebase/screen';
import Participant, { ParticipantProps } from './Participant/Participant';

export const ChooseableParticipant = (props: ParticipantProps) => {
  const { userGroup, groupToken } = useSessionContext();
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;

  if (!userGroup) {
    return null;
  }

  return (
    <div className="relative rounded-xl overflow-hidden">
      {userGroup === UserGroup.Moderator && props.participant.sid !== localParticipant.sid ? (
        <div
          className="group cursor-pointer transition-all duration-500 bg-white opacity-0 hover:opacity-95 bg-opacity-30 absolute top-0 left-0 w-full h-full z-30 flex items-center justify-center"
          onClick={() => {
            setCurrentPlayer(groupToken as string, props.participant.sid);
            setActiveScreen(groupToken as string, ScreenType.Game);
          }}
        >
          <button className="text-black bg-white rounded-full p-2 cursor-pointer">
            <img src="/assets/carousel.svg" className="w-12 transform group-hover:scale-50" alt="Gluecksrad Icon" />
          </button>
        </div>
      ) : null}
      <Participant {...props} />
    </div>
  );
};
