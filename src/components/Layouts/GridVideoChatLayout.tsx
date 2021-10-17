import useParticipants from 'hooks/useParticipants/useParticipants';
import useVideoContext from 'hooks/useVideoContext/useVideoContext';
import React from 'react';
import useSessionContext from 'hooks/useSessionContext';
import { ChooseableParticipant } from 'components/ChooseableParticipant';
import { subscribeToCarouselGame } from 'utils/firebase/game';
import { ISession } from 'types';
import { sortedParticipantsByCategorie } from 'utils/participants';
import { RevealedCard } from 'components/RevealedCard';
import { SessionInfo } from 'components/SessionInfo';

export const GridVideoChatLayout = () => {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const participants = useParticipants();
  const { sessionData, groupToken } = useSessionContext();

  const { moderatorParitcipants, normalParticipants } = sortedParticipantsByCategorie(
    sessionData as ISession,
    localParticipant,
    participants
  );

  const ModeratorLetterInfo = (props: { participant: { identity: string } }) => (
    <div className="flex justify-center items-center space-x-3">
      <span className="text-lg font-medium bg-orange rounded-full p-4 w-12 h-12 text-white flex justify-center items-center">
        {props.participant.identity[0].toUpperCase()}
      </span>
      <div className="flex flex-col">
        <span className="font-semibold">{props.participant.identity}</span>
        <span className="font-light">Moderator</span>
      </div>
    </div>
  );

  const ParticipantLetterInfo = (props: { participant: { identity: string } }) => (
    <div className="flex flex-col items-center space-y-1">
      <span className="uppercase rounded-full bg-purple text-2xl font-semibold w-12 h-12 text-white flex justify-center items-center">
        {props.participant.identity[0]}
      </span>
      <span className="">{props.participant.identity}</span>
    </div>
  );

  return (
    <div className="flex flex-col container mx-auto lg:px-32">
      <div className="flex space-x-6 py-10 items-center justify-between">
        <div className="flex space-x-6 items-start">
          <div className="flex items-center space-x-6 pr-10">
            {moderatorParitcipants.map(participant => (
              <ModeratorLetterInfo participant={participant} key={participant.sid} />
            ))}
          </div>
          <div className="flex items-center space-x-8 pr-10">
            {normalParticipants.map(participant => (
              <ParticipantLetterInfo participant={participant} key={participant.sid} />
            ))}
          </div>
        </div>

        <SessionInfo />
      </div>
      <div
        className="flex-grow h-full grid grid-cols-4 grid-rows-4 gap-2 justify-start items-start"
        style={{ width: 'calc(' }}
      >
        <div className="col-span-3 row-span-3 overflow-hidden aspect-w-16 aspect-h-9 h-full">
          {moderatorParitcipants.length >= 1 ? (
            <ChooseableParticipant participant={moderatorParitcipants[0]} isModerator />
          ) : null}
        </div>
        <RevealedCard />
        {/* <Participant isLocalParticipant participant={localParticipant} /> */}
        {moderatorParitcipants
          .filter((part, i) => i > 0)
          .map(participant => (
            <div className="aspect-w-16 aspect-h-9 h-full">
              <ChooseableParticipant
                participant={participant}
                key={participant.sid}
                isLocalParticipant={localParticipant.sid === participant.sid}
                isModerator
              />
            </div>
          ))}
        {normalParticipants.map(participant => (
          <div>
            <ChooseableParticipant
              participant={participant}
              key={participant.sid}
              isLocalParticipant={localParticipant.sid === participant.sid}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
