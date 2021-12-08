import useParticipants from 'hooks/useParticipants/useParticipants';
import useVideoContext from 'hooks/useVideoContext/useVideoContext';
import React, { useEffect, useRef, useState } from 'react';
import useSessionContext from 'hooks/useSessionContext';
import { ChooseableParticipant } from 'components/ChooseableParticipant';
import { categorizeParticipants } from 'utils/participants';
import { RevealedCard } from 'components/RevealedCard';
import { SessionInfo } from 'components/SessionInfo';
import { subscribeToSessionStore, unsubscribeFromSessionStore } from 'utils/firebase/session';
import { nameFromIdentity } from 'utils/participants';
import cn from 'classnames';
import { UserGroup } from 'types/UserGroup';

const LetterInfo = (props: { participant: { identity: string }; isModerator?: boolean }) => {
  const name = nameFromIdentity(props.participant.identity);

  return (
    <div className="space-y-1 w-24 flex flex-col items-center">
      <span
        className={cn(
          'uppercase rounded-full text-xl font-medium w-12 h-12 text-white flex justify-center items-center',
          {
            'bg-purple': !props.isModerator,
            'bg-orange': props.isModerator,
          }
        )}
      >
        {name.charAt(0).toUpperCase()}
      </span>
      <span className="break-words w-full text-center">{name}</span>
    </div>
  );
};

export const GridVideoChatLayout = () => {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const participants = useParticipants();
  const { groupToken, resources, userGroup } = useSessionContext();
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

  const { moderatorParitcipants, normalParticipants, speakerParticipants } = categorizeParticipants(
    participants,
    localParticipant,
    moderators
  );

  return (
    <div className="flex flex-col">
      {userGroup === UserGroup.StreamServer || userGroup === UserGroup.StreamServerTranslated ? (
        <div className="h-10" />
      ) : null}
      <div className="pt-5">
        <SessionInfo />
      </div>
      {userGroup === UserGroup.StreamServer || userGroup === UserGroup.StreamServerTranslated ? (
        <div className="h-5" />
      ) : null}
      <div className="flex space-x-6 pb-5 pt-5 items-center justify-between">
        <div className="flex space-x-10 w-full items-center pr-2">
          <div className="flex flex-col space-y-5">
            <img src={resources.hostLogoSrc} className="h-12" />
          </div>
          <div className="flex space-x-6 items-start overflow-y-auto flex-grow">
            <div className="flex items-start space-x-8 pr-10">
              {moderatorParitcipants.map(participant => (
                <>
                  <LetterInfo isModerator participant={participant} key={participant.sid} />
                </>
              ))}
              {normalParticipants.map(participant => (
                <LetterInfo participant={participant} key={participant.sid} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-5" />
      {userGroup === UserGroup.StreamServer || userGroup === UserGroup.StreamServerTranslated ? (
        <div className="h-5" />
      ) : null}
      <div className="w-full aspect-w-16 aspect-h-9">
        <div className="grid grid-cols-4 grid-rows-4 gap-2 justify-center items-center">
          {normalParticipants.map(participant => (
            <div key={participant.sid}>
              <ChooseableParticipant
                participant={participant}
                isLocalParticipant={localParticipant.sid === participant.sid}
              />
            </div>
          ))}
          <div
            className={
              speakerParticipants.length < 8
                ? 'col-span-3 row-span-3 col-start-1 row-start-1'
                : 'col-start-2 row-start-1 col-span-2 row-span-2'
            }
          >
            {moderatorParitcipants.length >= 1 ? (
              <ChooseableParticipant
                participant={moderatorParitcipants[0]}
                isModerator
                isLocalParticipant={localParticipant.sid === moderatorParitcipants[0].sid}
              />
            ) : null}
          </div>
          <div className="aspect-w-16 aspect-h-9 col-start-4 row-start-1">
            <RevealedCard />
          </div>
          {/* <Participant isLocalParticipant participant={localParticipant} /> */}
        </div>
      </div>
    </div>
  );
};
