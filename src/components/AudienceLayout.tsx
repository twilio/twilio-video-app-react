import useChatContext from 'hooks/useChatContext/useChatContext';
import useSessionContext from 'hooks/useSessionContext';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { UserGroup } from 'types';
import { getUid } from 'utils/firebase/base';
import {
  raiseHand,
  removeAudienceMemberInvitation,
  subscribeToSessionStore,
  unraiseHand,
} from 'utils/firebase/session';
import { generateIdentity } from 'utils/participants';
import ToggleChatButton from './Buttons/ToggleChatButton/ToggleChatButton';
import ChatWindow from './ChatWindow/ChatWindow';
import PreJoinScreens from './PreJoinScreens/PreJoinScreens';

export const AudienceLayout = () => {
  const { streamId, groupToken } = useSessionContext();
  const [ready, setReady] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [identity, setIdentity] = useState<string>();
  const history = useHistory();
  const identityRef = useRef<string>();
  identityRef.current = identity;

  const toggleHandRaise = () => {
    if (groupToken === undefined || identityRef.current === undefined) {
      return;
    } else if (handRaised) {
      unraiseHand(groupToken, identityRef.current);
    } else {
      raiseHand(groupToken, identityRef.current);
    }
  };

  const joinCall = (participantRoute: string) => {
    const id = identityRef.current;
    if (id && groupToken) {
      Promise.all([unraiseHand(groupToken, id), removeAudienceMemberInvitation(groupToken, id)]).then(() => {
        window.location.href = '/r/' + participantRoute;
      });
    }
  };

  const buttonClassName = 'rounded-full shadow-xl flex items-center justify-center w-12 h-12';

  const RaiseHandButton = () => {
    return (
      <button
        className={buttonClassName + ` relative ${handRaised ? 'bg-purple text-white' : 'bg-white'}`}
        onClick={toggleHandRaise}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill={'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
          />
        </svg>
      </button>
    );
  };

  useEffect(() => {
    if (groupToken !== undefined) {
      subscribeToSessionStore('AUDIENCE_LAYOUT', groupToken, store => {
        const id = identityRef.current;
        if (id === undefined) {
          return;
        }

        const raisedHands = store.data.raisedHands ?? [];
        const audienceInvites = store.data.audienceInvites ?? [];

        setHandRaised(raisedHands.includes(id));

        console.log(id, audienceInvites);

        if (audienceInvites.includes(id)) {
          const [participantRoute] = Object.entries(store.data.shareTokens).find(([token, group]) => {
            console.log(group.toUpperCase(), UserGroup.Participant, group.toUpperCase() === UserGroup.Participant);
            return group.toUpperCase() === UserGroup.Participant;
          }) ?? [undefined];
          console.log(participantRoute, UserGroup.Participant);

          if (participantRoute !== undefined) {
            joinCall(participantRoute);
          }
        }
      });
    }
  }, [groupToken]);

  return !ready ? (
    <PreJoinScreens
      onReady={name => {
        generateIdentity(name).then(setIdentity);
        setReady(true);
      }}
    />
  ) : (
    <>
      <div className="fixed bottom-10 w-full flex items-center justify-center space-x-2">
        <ToggleChatButton className={buttonClassName + ' bg-white'} />
        <RaiseHandButton />
      </div>

      <ChatWindow />
      <div className="w-full h-full bg-grayish">
        <iframe
          src={`https://player.vimeo.com/video/${streamId}?background=1`}
          className="w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
};
