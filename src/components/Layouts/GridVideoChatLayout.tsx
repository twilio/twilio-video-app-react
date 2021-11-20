import useParticipants from 'hooks/useParticipants/useParticipants';
import useVideoContext from 'hooks/useVideoContext/useVideoContext';
import React, { useEffect, useState } from 'react';
import useSessionContext from 'hooks/useSessionContext';
import { ChooseableParticipant } from 'components/ChooseableParticipant';
import { sortedParticipantsByCategorie } from 'utils/participants';
import { RevealedCard } from 'components/RevealedCard';
import { SessionInfo } from 'components/SessionInfo';
import { subscribeToSessionStore, unsubscribeFromSessionStore } from 'utils/firebase/session';
import { nameFromIdentity } from 'utils/participants';

export const GridVideoChatLayout = () => {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const participants = useParticipants();
  const { groupToken, resources } = useSessionContext();
  const [moderators, setModerators] = useState<string[]>([]);

  useEffect(() => {
    const subId = 'participant-list';

    if (groupToken !== undefined) {
      subscribeToSessionStore(subId, groupToken, store => {
        setModerators(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(store.data.moderators)) {
            return store.data.moderators ?? [];
          } else {
            return prev;
          }
        });
      });
    }

    return () => {
      unsubscribeFromSessionStore(subId);
    };
  }, []);

  const { moderatorParitcipants, normalParticipants } = sortedParticipantsByCategorie(
    moderators,
    localParticipant,
    participants
  );

  const ModeratorLetterInfo = (props: { participant: { identity: string } }) => (
    <div className="flex flex-col justify-center items-center space-y-1">
      <span className="text-xl font-medium bg-orange rounded-full p-4 w-12 h-12 text-white flex justify-center items-center">
        {nameFromIdentity(props.participant.identity)
          .charAt(0)
          .toUpperCase()}
      </span>
      <div className="flex flex-col items-center">
        <span className="font-semibold">{nameFromIdentity(props.participant.identity)}</span>
        {/* <span className="font-light">Moderation</span> */}
      </div>
    </div>
  );

  const ParticipantLetterInfo = (props: { participant: { identity: string } }) => (
    <div className="flex flex-col items-center space-y-1">
      <span className="uppercase rounded-full text-xl bg-purple font-medium w-12 h-12 text-white flex justify-center items-center">
        {nameFromIdentity(props.participant.identity)
          .charAt(0)
          .toUpperCase()}
      </span>
      <span className="">{nameFromIdentity(props.participant.identity)}</span>
    </div>
  );

  return (
    <div className="flex flex-col container mx-auto lg:px-32">
      <div className="flex space-x-6 pb-5 pt-10 items-center justify-between">
        <div className="flex space-x-10 items-center">
          <img src={resources.hostLogoSrc} className="h-12" />
          <div className="flex space-x-6 items-start">
            <div className="flex items-center space-x-8 pr-10">
              {moderatorParitcipants.map(participant => (
                <ModeratorLetterInfo participant={participant} key={participant.sid} />
              ))}
              {normalParticipants.map(participant => (
                <ParticipantLetterInfo participant={participant} key={participant.sid} />
              ))}
            </div>
          </div>
        </div>

        <SessionInfo />
      </div>
      <div
        className="flex-grow h-full grid grid-cols-4 grid-rows-4 gap-2 justify-center items-center"
        style={{ width: 'calc(' }}
      >
        <div className="col-span-3 row-span-3 overflow-hidden">
          {moderatorParitcipants.length >= 1 ? (
            <ChooseableParticipant
              participant={moderatorParitcipants[0]}
              isModerator
              isLocalParticipant={localParticipant.sid === moderatorParitcipants[0].sid}
            />
          ) : null}
        </div>
        <div className="aspect-w-16 aspect-h-9">
          <RevealedCard />
        </div>
        {/* <Participant isLocalParticipant participant={localParticipant} /> */}
        {moderatorParitcipants
          .filter((part, i) => i > 0)
          .map(participant => (
            <div key={participant.sid}>
              <ChooseableParticipant
                participant={participant}
                key={participant.sid}
                isLocalParticipant={localParticipant.sid === participant.sid}
                isModerator
              />
            </div>
          ))}
        {normalParticipants.map(participant => (
          <div key={participant.sid}>
            <ChooseableParticipant
              participant={participant}
              isLocalParticipant={localParticipant.sid === participant.sid}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
